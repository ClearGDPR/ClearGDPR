import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import 'theme/Paginate.css';

const Paginate = ({ pageCount, onPageChange }) => (
  <ReactPaginate
    containerClassName="react-paginate"
    pageCount={pageCount}
    marginPagesDisplayed={2}
    pageRangeDisplayed={5}
    onPageChange={onPageChange}
  />
);

Paginate.propTypes = {
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Paginate;
