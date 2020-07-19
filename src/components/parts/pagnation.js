import React from "react"
import { Link } from "gatsby"

const Pagination = ({ location, pageNumber, hasNextPage }) => {

  let prev = location.pathname.split("/")
  prev[2] = Number(prev[2]) - 1
  let newPrevPath = prev.join('/')

  let next = location.pathname.split("/")
  next[2] = Number(next[2]) + 1
  let newNextPath = next.join('/')

  if (pageNumber === 0 && !hasNextPage) return null

  return (
    <div className="pagnation">
      {pageNumber > 0 && (
        <Link className="prev page-numbers" to={pageNumber > 1 ? newPrevPath : newPrevPath}>
          <span>Previous page</span>
        </Link>
      )}

      <span className="page-numbers current">
      {pageNumber === 0 ? `` : (
        <span className="meta-nav screen-reader-text">Page {pageNumber}</span>
      )}
      </span>

      {hasNextPage && (
          <Link className="next page-numbers" to={newNextPath}>
            <span>Next page</span>
          </Link>
        )}
    </div>
  )
}

export default Pagination