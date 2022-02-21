import { useEffect, useMemo, useState } from "react"

export default function useVirtualData({
  data,
  rowHeight,
  cellGap,
  parentRef,
  before = 0,
  after = 0,
}) {

  const dataWithIndexes = useMemo(() => data.map((datum, index) => ({ ...datum, index })), [data])

  const rowHeightPlusCellGap = rowHeight + cellGap

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop:
  // An element's scrollTop value is a measurement of the distance 
  // from the element's top to its topmost visible content. 
  // When an element's content does not generate a vertical scrollbar, 
  // then its scrollTop value is 0.
  const [scrollTop, setScrollTop] = useState(0)
  useEffect(() => {
    const handleParentScroll = () => setScrollTop(parentRef.current?.scrollTop)
    parentRef.current?.addEventListener('scroll', handleParentScroll)
    return () => parentRef.current?.removeEventListener('scroll', handleParentScroll)
  }, [parentRef.current])

  // The number of rows that should be displayed is equal to the height 
  // of the container divided by the row height.
  const [containerHeight, setContainerHeight] = useState(0)
  const handleWindowResize = () => setContainerHeight(parentRef.current?.clientHeight)
  useEffect(handleWindowResize, [])
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  const numRowsToDisplay = Math.ceil(containerHeight / rowHeightPlusCellGap)

  const numRows = data.length

  // The first row to display is the container's scrollTop divided by the row height:
  const firstRowIndex = Math.max(0, Math.floor(scrollTop / rowHeightPlusCellGap) - before)
  const lastRowIndex = Math.min(firstRowIndex + before + numRowsToDisplay + after, numRows)

  const virtualData = dataWithIndexes.slice(firstRowIndex, lastRowIndex)

  // add 1 row for the header
  const gridTemplateRows = `repeat(${numRows + 1}, ${rowHeight}px)`

  return { virtualData, gridTemplateRows }
}
