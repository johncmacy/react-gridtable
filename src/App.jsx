import { useMemo } from "react"
import GridTable from "./grid-table/GridTable"

export default function App() {

  const data = useMemo(() => Array.from({ length: 10000 }).map((_, i) => ({
    a: i,
    b: i * 2,
    c: i ** 2,
    d: i - 1,
    e: i * (i + 1),
    f: i ** 3,
    g: i ** i,
  })), [])

  return (
    <>
      <div><h1>Hello</h1></div>

      <GridTable
        name="app"
        columns={[
          { text: 'A', accessor: 'a', },
          { text: 'B', accessor: 'b', },
          { text: 'C', accessor: 'c', },
          { text: 'D', accessor: 'd', },
          { text: 'E', accessor: 'e', },
          { text: 'F', accessor: 'f', },
          { text: 'G', accessor: 'g', width: '1fr', },
        ]}
        data={data}
        before={10}
        after={10}
      />
    </>
  )
}
