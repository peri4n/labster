import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/collections/')({
  component: CollectionPage,
})

function CollectionPage() {
  return <div>Hello "/collections/"!</div>
}
