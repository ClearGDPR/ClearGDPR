import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import 'theme/Paginate.css';

const Paginate = props => (
  <ReactPaginate
    {...props}
    containerClassName="react-paginate"
    marginPagesDisplayed={2}
    pageRangeDisplayed={5}
  />
);

Paginate.propTypes = {
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  disableInitialCallback: PropTypes.bool
};

export default Paginate;
