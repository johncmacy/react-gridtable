import { useCallback, useLayoutEffect, useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"
import { useVirtual } from "react-virtual"
import { useDebounce } from "usehooks-ts"

const ROW_HEIGHT = 30

const cellStyle = {
  display: 'flex',
  padding: '2px 5px',
  alignItems: 'center',
}

interface Column {
  text: string,
  width?: string,
  accessor: string | Function,
}

interface GridTableParams {
  name: string,
  columns: Column[],
  data: any[],
}

export default function GridTable({
  name,
  columns,
  data,
}: GridTableParams) {

  const dataWithIndexes = data.map((datum, index) => ({ ...datum, index }))

  const gridTemplateColumns = columns.map(column => column.width ?? 'min-content').join(' ')

  const viewWindowRef = useRef()
  const gridTableBodyRef = useRef()

  // const { virtualItems, totalSize } = useVirtual({
  //   size: data.length,
  //   gridTableBodyRef,
  //   estimateSize: useCallback(() => ROW_HEIGHT, []),
  //   overscan: 5,
  // })

  const [numChildren, setNumChildren] = useState(0)
  useEffect(
    () => setNumChildren(gridTableBodyRef.current?.children?.length),
    []
  )

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop:
  // An element's scrollTop value is a measurement of the distance 
  // from the element's top to its topmost visible content. 
  // When an element's content does not generate a vertical scrollbar, 
  // then its scrollTop value is 0.
  const [scrollTop, setScrollTop] = useState(0)

  // The number of rows that should be displayed is equal to the height 
  // of the container divided by the row height.
  const [containerHeight, setContainerHeight] = useState(0)
  const handler = () => setContainerHeight(viewWindowRef.current?.clientHeight)
  useEffect(handler, [])
  useEffect(() => {
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const numRowsToDisplay = Math.ceil(containerHeight / ROW_HEIGHT)

  // The first row to display is the container's scrollTop divided by the row height:
  const firstRowIndex = Math.floor(scrollTop / ROW_HEIGHT)
  const lastRowIndex = firstRowIndex + numRowsToDisplay

  const dataToRender = dataWithIndexes.slice(firstRowIndex, lastRowIndex)

  return (
    <div style={{
      flex: 1,
      display: 'grid',
      gridTemplateRows: '1fr auto',
      gap: '1rem',
      border: '1px solid red',
      background: '#ddd',
      overflow: 'hidden',
    }}>

      <div
        id="view-window"
        style={{
          border: '1px solid black',
          background: '#eee',
          overflowY: 'auto',
          position: 'relative',
        }}
        ref={viewWindowRef}
        onScroll={() => setScrollTop(viewWindowRef.current?.scrollTop)}
      >

        <div
          id="grid-table-body"
          ref={gridTableBodyRef}
          style={{
            display: 'grid',
            gridTemplateColumns,
            gridTemplateRows: `repeat(${data.length}, ${ROW_HEIGHT}px)`,
            // height: totalSize,
          }}>

          {/* header cells */}
          {columns.map(
            (column, i) =>
              <div key={i} style={{
                ...cellStyle,
                position: 'sticky',
                top: 0,
                background: 'white',
                gridRow: 1,
              }}>
                {column.text}
              </div>
          )}

          {/* body cells */}
          {dataToRender.map(
            datum => {
              // let datum = data[virtualItem.index]

              return (
                columns.map(
                  (column, j) => (
                    <div key={`${datum.index}-${j}`} style={{
                      // this is the important part!!!
                      // it sets the gridRow for this row's cells to index + 1 + 1 for the header cells, 
                      // which will keep its position within the grid, even if
                      // the cells before it are removed from the DOM
                      gridRow: datum.index + 1 + 1,
                      ...cellStyle,
                    }}>

                      {typeof column.accessor === 'string' ?
                        datum[column.accessor]
                        : typeof column.accessor === 'function' ?
                          column.accessor(datum)
                          : null}

                    </div>
                  )
                )
              )
            }
          )}

        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2rem', }}>
        <span>{numChildren} child elements</span>
        <span>scrollTop: {scrollTop}</span>
        <span>containerHeight: {containerHeight}</span>
        <span>numRowsToDisplay: {numRowsToDisplay}</span>
        <span>firstRowIndex: {firstRowIndex}</span>
        <span>lastRowIndex: {lastRowIndex}</span>
      </div>
    </div>
  )
}
