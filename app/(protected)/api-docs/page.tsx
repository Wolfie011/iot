import { getApiDocs } from "@/lib/openapi/swaggerUI"
import ReactSwagger from "./react-swagger"

export default async function IndexPage() {
  const spec = await getApiDocs()

  return (
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 w-fill h-full overflow-hidden">
          <ReactSwagger spec={spec} />
        </div>
      </div>
  )
}
