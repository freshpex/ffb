import PropTypes from 'prop-types';

const CardLoader = ({ title, height }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 shadow ${height} animate-pulse`}>
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-1/3 bg-gray-700 rounded"></div>
        <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
      </div>
      
      <div className="space-y-4">
        <div className="h-24 bg-gray-700 rounded"></div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

CardLoader.propTypes = {
  title: PropTypes.string,
  height: PropTypes.string
};

CardLoader.defaultProps = {
  title: 'Loading...',
  height: 'h-64'
};

export default CardLoader;
