import { useRef } from "react"
import useVirtualData from "./useVirtualData"

const cellStyle = {
  display: 'flex',
  padding: '2px 5px',
  alignItems: 'center',
  outline: '1px solid black',
}

interface Column {
  text: string,
  width?: string,
  accessor: string | Function,
}

interface GridTableParams {
  columns: Column[],
  data: any[],
  rowHeight?: Number,
  cellGap?: Number,
  before?: Number,
  after?: Number,
}

export default function GridTable({
  columns,
  rowHeight = 30,
  cellGap = 1,
  before = 0,
  after = 0,
  data,
}: GridTableParams) {

  // const dataWithIndexes = data.map((datum, index) => ({ ...datum, index }))

  const gridTemplateColumns = columns.map(column => column.width ?? 'min-content').join(' ')

  const parentRef = useRef()

  // // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop:
  // // An element's scrollTop value is a measurement of the distance 
  // // from the element's top to its topmost visible content. 
  // // When an element's content does not generate a vertical scrollbar, 
  // // then its scrollTop value is 0.
  // const [scrollTop, setScrollTop] = useState(0)
  // useEffect(() => {
  //   console.log('setting parent scroll handler')
  //   const handleParentScroll = () => setScrollTop(parentRef.current?.scrollTop)
  //   parentRef.current?.addEventListener('scroll', handleParentScroll)
  //   return () => parentRef.current?.removeEventListener('scroll', handleParentScroll)
  // }, [parentRef.current])

  // // The number of rows that should be displayed is equal to the height 
  // // of the container divided by the row height.
  // const [containerHeight, setContainerHeight] = useState(0)
  // const handleWindowResize = () => setContainerHeight(parentRef.current?.clientHeight)
  // useEffect(handleWindowResize, [])
  // useEffect(() => {
  //   window.addEventListener('resize', handleWindowResize)
  //   return () => window.removeEventListener('resize', handleWindowResize)
  // }, [])

  // const numRowsToDisplay = Math.ceil(containerHeight / ROW_HEIGHT)

  // const numRows = data.length

  // // The first row to display is the container's scrollTop divided by the row height:
  // const firstRowIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - before)
  // const lastRowIndex = Math.min(firstRowIndex + before + numRowsToDisplay + after, numRows)

  // const dataToRender = dataWithIndexes.slice(firstRowIndex, lastRowIndex)

  const { virtualData, gridTemplateRows } = useVirtualData({
    data,
    rowHeight,
    cellGap,
    parentRef,
    before,
    after,
  })

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
        ref={parentRef}
      >

        <div
          id="grid-table-body"
          style={{
            display: 'grid',
            gridTemplateColumns,
            gridTemplateRows,
            gap: cellGap,
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
          {virtualData.map(
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

      {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2rem', }}>
        <span>scrollTop: {scrollTop}</span>
        <span>containerHeight: {containerHeight}</span>
        <span>numRowsToDisplay: {numRowsToDisplay}</span>
        <span>firstRowIndex: {firstRowIndex}</span>
        <span>lastRowIndex: {lastRowIndex}</span>
      </div> */}
    </div>
  )
}
