import Feature from 'app/bundles/custom/pages/compilation'
import { useSession } from 'protolib'

export default function CompilationPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps