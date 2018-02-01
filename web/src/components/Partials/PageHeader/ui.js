// Import from packages
import React from 'react';
import ArrowLeft from 'react-icons/lib/fa/chevron-left';

// Import styles
import './style.scss';

/**
 * User interface for Page Header component
 *
 * @param {Object} param - Object parameter
 * @param {string} param.text - Title text
 * @param {Boolean} param.isSub - If the pageheader is a actually sub-header or not
 * @return The component HTML template
 */
const PageHeaderUI = ({ text, isSub }) => {
  return (
    <div className={'page-header' + (isSub ? ' link' : '')}>
      {isSub && (
        <span className="left-arrow">
          <ArrowLeft />
        </span>
      )}
      <span>{text}</span>
    </div>
  );
};

export default PageHeaderUI;
