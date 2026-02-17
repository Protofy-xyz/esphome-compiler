#!/usr/bin/env bash
set -euo pipefail

# Simple nginx setup for ESPHome dashboard + main app with selectable TLS mode.
# Run as: sudo bash scripts/nginx-setup.sh

if [[ "$EUID" -ne 0 ]]; then
  echo "This script must be run as root. Try:"
  echo "  sudo bash $0"
  exit 1
fi

# --- Check nginx --------------------------------------------------------------

if ! command -v nginx >/dev/null 2>&1; then
  echo "nginx is not installed or not in PATH."
  echo "Please install it first, e.g.:"
  echo "  sudo apt-get update && sudo apt-get install -y nginx"
  exit 1
fi

# --- Ask for configuration ----------------------------------------------------

read -rp "Enter server name (e.g. compile.protofy.xyz): " SERVER_NAME
if [[ -z "${SERVER_NAME}" ]]; then
  echo "Server name cannot be empty."
  exit 1
fi

read -rp "ESPHome dashboard port [6052]: " ESPHOME_PORT
ESPHOME_PORT=${ESPHOME_PORT:-6052}

read -rp "Main app port (your project) [8000]: " MAIN_APP_PORT
MAIN_APP_PORT=${MAIN_APP_PORT:-8000}

echo
echo "TLS mode:"
echo "  1) Let's Encrypt (real certificate, requires public DNS + open 80)"
echo "  2) Self-signed certificate (browser will show 'Not secure', but works)"
read -rp "Choose TLS mode [1/2] (default 1): " TLS_MODE
TLS_MODE=${TLS_MODE:-1}

EMAIL=""
if [[ "${TLS_MODE}" == "1" ]]; then
  if ! command -v certbot >/dev/null 2>&1; then
    echo "certbot is not installed or not in PATH."
    echo "Please install it first, e.g.:"
    echo "  sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx"
    exit 1
  fi

  read -rp "Email for Let's Encrypt (used for renewal notices): " EMAIL
  if [[ -z "${EMAIL}" ]]; then
    echo "Email is required for Let's Encrypt mode."
    exit 1
  fi
fi

SITE_NAME="esphome-dashboard"
NGINX_AVAILABLE="/etc/nginx/sites-available/${SITE_NAME}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${SITE_NAME}"

CERT_DIR=""
FULLCHAIN_PATH=""
PRIVKEY_PATH=""
DHPARAM_PATH=""

if [[ "${TLS_MODE}" == "1" ]]; then
  # Let's Encrypt directory
  CERT_DIR="/etc/letsencrypt/live/${SERVER_NAME}"
  FULLCHAIN_PATH="${CERT_DIR}/fullchain.pem"
  PRIVKEY_PATH="${CERT_DIR}/privkey.pem"
else
  # Self-signed directory
  CERT_DIR="/etc/nginx/selfsigned/${SERVER_NAME}"
  mkdir -p "${CERT_DIR}"
  FULLCHAIN_PATH="${CERT_DIR}/fullchain.pem"
  PRIVKEY_PATH="${CERT_DIR}/privkey.pem"
  DHPARAM_PATH="${CERT_DIR}/dhparam.pem"
fi

echo
echo "Summary:"
echo "  Server name:      ${SERVER_NAME}"
echo "  ESPHome port:     ${ESPHOME_PORT}"
echo "  Main app port:    ${MAIN_APP_PORT}"
echo "  TLS mode:         ${TLS_MODE} ($([[ "${TLS_MODE}" == "1" ]] && echo "Let's Encrypt" || echo "Self-signed"))"
echo "  Nginx site name:  ${SITE_NAME}"
echo "  Cert directory:   ${CERT_DIR}"
echo
read -rp "Continue with nginx config and certificate setup? [y/N]: " CONFIRM
CONFIRM=${CONFIRM:-n}
if [[ "${CONFIRM}" != "y" && "${CONFIRM}" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

# --- TLS / certificate handling ----------------------------------------------

if [[ "${TLS_MODE}" == "1" ]]; then
  # Let's Encrypt mode

  # Remove all previous certbot certificates for this domain (including -0001, -0002, etc.)
  # so certbot always creates a clean entry at the expected path.
  echo
  echo ">>> Removing previous Let's Encrypt certificates for ${SERVER_NAME} ..."
  for cert_name in $(certbot certificates 2>/dev/null \
      | grep "Certificate Name:" | awk '{print $3}'); do
    case "${cert_name}" in
      "${SERVER_NAME}" | "${SERVER_NAME}"-[0-9]*)
        echo "    Deleting cert: ${cert_name}"
        certbot delete --cert-name "${cert_name}" --non-interactive 2>/dev/null || true
        ;;
    esac
  done
  # Clean up any leftover live/archive/renewal dirs that certbot may have missed
  rm -rf /etc/letsencrypt/live/${SERVER_NAME}    /etc/letsencrypt/live/${SERVER_NAME}-[0-9]*
  rm -rf /etc/letsencrypt/archive/${SERVER_NAME} /etc/letsencrypt/archive/${SERVER_NAME}-[0-9]*
  rm -f  /etc/letsencrypt/renewal/${SERVER_NAME}.conf /etc/letsencrypt/renewal/${SERVER_NAME}-[0-9]*.conf

  echo ">>> Stopping nginx (if running) to allow certbot standalone on :80 ..."
  systemctl stop nginx || true

  echo ">>> Requesting fresh Let's Encrypt certificate for ${SERVER_NAME} ..."
  if certbot certonly \
      --standalone \
      --preferred-challenges http \
      -d "${SERVER_NAME}" \
      -m "${EMAIL}" \
      --agree-tos \
      --non-interactive; then
    echo ">>> Certificate obtained successfully."
  else
    echo "!!! certbot failed. Cannot continue in Let's Encrypt mode."
    echo ">>> Please re-run and choose self-signed (option 2)."
    exit 1
  fi
else
  # Self-signed mode
  echo
  if [[ -f "${FULLCHAIN_PATH}" && -f "${PRIVKEY_PATH}" ]]; then
    echo ">>> Existing self-signed cert found for ${SERVER_NAME}, reusing it:"
    echo "      ${FULLCHAIN_PATH}"
    echo "      ${PRIVKEY_PATH}"
  else
    echo ">>> Generating self-signed certificate for ${SERVER_NAME} ..."
    openssl req -x509 -nodes -days 365 \
      -newkey rsa:2048 \
      -keyout "${PRIVKEY_PATH}" \
      -out "${FULLCHAIN_PATH}" \
      -subj "/CN=${SERVER_NAME}"
    echo ">>> Self-signed certificate created."
  fi

  if [[ -z "${DHPARAM_PATH}" ]]; then
    DHPARAM_PATH="${CERT_DIR}/dhparam.pem"
  fi

  if [[ -f "${DHPARAM_PATH}" ]]; then
    echo ">>> Reusing existing DH parameters: ${DHPARAM_PATH}"
  else
    echo ">>> Generating DH parameters (this may take a bit) ..."
    openssl dhparam -out "${DHPARAM_PATH}" 2048
    echo ">>> DH parameters generated at ${DHPARAM_PATH}"
  fi
fi

# --- SSL options / dhparam include lines for nginx ---------------------------

SSL_OPTIONS_INCLUDE=""
SSL_DHPARAM_LINE=""

# If Let's Encrypt's options file exists, use it (works for both modes)
if [[ -f /etc/letsencrypt/options-ssl-nginx.conf ]]; then
  SSL_OPTIONS_INCLUDE="    include /etc/letsencrypt/options-ssl-nginx.conf;"
fi

if [[ "${TLS_MODE}" == "1" ]]; then
  # Use LE's dhparams if present
  if [[ -f /etc/letsencrypt/ssl-dhparams.pem ]]; then
    SSL_DHPARAM_LINE="    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;"
  fi
else
  # Use the self-signed dhparam path
  SSL_DHPARAM_LINE="    ssl_dhparam ${DHPARAM_PATH};"
fi

# --- Write nginx config -------------------------------------------------------

echo
echo ">>> Writing nginx config to ${NGINX_AVAILABLE} ..."

cat > "${NGINX_AVAILABLE}" <<EOF
# HTTP: redirect /esphome to HTTPS, rest → main project on port ${MAIN_APP_PORT}
server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAME};

    # If path starts with /esphome → force HTTPS
    location ^~ /esphome {
        return 301 https://\$host\$request_uri;
    }

    # Everything else goes to your main project (port ${MAIN_APP_PORT})
    location / {
        proxy_pass http://127.0.0.1:${MAIN_APP_PORT};
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto http;
    }
}

# HTTPS: main project on / and ESPHome mounted on /esphome
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${SERVER_NAME};

    ssl_certificate ${FULLCHAIN_PATH};
    ssl_certificate_key ${PRIVKEY_PATH};
${SSL_OPTIONS_INCLUDE}
${SSL_DHPARAM_LINE}

    # --- ESPHome WebSocket: wss://${SERVER_NAME}/esphome/ace ---
    location = /esphome/ace {
        proxy_pass http://127.0.0.1:${ESPHOME_PORT}/ace;
        proxy_http_version 1.1;

        # WebSocket
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";

        # Standard headers
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # Force Origin so ESPHome accepts it
        proxy_set_header Origin https://${SERVER_NAME};

        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # --- ESPHome Dashboard: https://${SERVER_NAME}/esphome/... ---
    # Note the trailing / in proxy_pass so /esphome/foo → /foo in ESPHome
    location ^~ /esphome/ {
        proxy_pass http://127.0.0.1:${ESPHOME_PORT}/;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # --- Rest of HTTPS routes: main project (port ${MAIN_APP_PORT}) ---
    location / {
        proxy_pass http://127.0.0.1:${MAIN_APP_PORT};
        proxy_http_version 1.1;

        # WebSocket support for main app (e.g. /websocket)
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
EOF

# Enable site
mkdir -p /etc/nginx/sites-enabled
if [[ ! -L "${NGINX_ENABLED}" ]]; then
  ln -s "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"
fi

# Disable default site if present
if [[ -e /etc/nginx/sites-enabled/default ]]; then
  echo ">>> Disabling default nginx site ..."
  rm -f /etc/nginx/sites-enabled/default
fi

# --- Test and restart nginx ---------------------------------------------------

echo
echo ">>> Testing nginx configuration ..."
nginx -t

echo ">>> Starting/restarting nginx ..."
systemctl restart nginx

echo
echo "Done!"
echo "  - HTTPS should be available at: https://${SERVER_NAME}/"
echo "  - ESPHome dashboard at:        https://${SERVER_NAME}/esphome/"
echo "  - Ensure your ESPHome Docker is bound to 127.0.0.1:${ESPHOME_PORT}."
