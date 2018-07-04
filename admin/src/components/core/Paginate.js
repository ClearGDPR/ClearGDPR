import React from 'react';
import ReactPaginate from 'react-paginate';
import 'theme/Paginate.css';

export default ({ pageCount, onPageChange }) => (
  <ReactPaginate
    containerClassName="react-paginate"
    pageCount={pageCount}
    marginPagesDisplayed={2}
    pageRangeDisplayed={5}
    onPageChange={onPageChange}
  />
);
