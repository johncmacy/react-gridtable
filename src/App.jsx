import { useMemo } from "react"
import GridTable from "./grid-table/GridTable"

export default function App() {

  const data = useMemo(() => Array.from({ length: 10000 }).map((_, i) => ({
    a: i,
    b: i * 2,
    c: i ** 2,
  })), [])

  return (
    <>
      <div><h1>Hello</h1></div>

      <GridTable
        name="app"
        columns={[
          { text: 'A', accessor: 'a', },
          { text: 'B', accessor: 'b', width: '15em', },
          { text: 'C', accessor: 'c', width: '1fr', },
        ]}
        data={data}
      />
    </>
  )
}
