// Import from packages
import React from 'react';
import ArrowRight from 'react-icons/lib/fa/chevron-right';

// Import styles
import './style.scss';

/**
 * User interface for subheader component
 *
 * @param {Object} param - Object parameter
 * @param {string} param.text - Subheader text
 * @param {Boolean} param.topBorder - If the subheader should have a top border or not
 * @return The component HTML template
 */
const SubHeaderMobileUI = ({ text, topBorder }) => {
  return (
    <div className={'sub-header-mobile' + (topBorder ? ' has-border-top' : '')}>
      <span>{text}</span>
      <span className="right-arrow">
        <ArrowRight />
      </span>
    </div>
  );
};

export default SubHeaderMobileUI;
