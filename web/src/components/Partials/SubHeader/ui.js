// Import from packages
import React from 'react';

// Import styles
import './style.scss';

/**
 * User interface for subheader component
 *
 * @param {Object} param - Object parameter
 * @param {string} param.text - Subheader text
 * @return The component HTML template
 */
const SubHeaderUI = ({ text }) => {
  return (
    <div className="sub-header">
      <div className="background">
        <span>{text}</span>
      </div>
    </div>
  );
};

export default SubHeaderUI;
