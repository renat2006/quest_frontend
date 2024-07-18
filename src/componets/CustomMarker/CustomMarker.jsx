import React from 'react';
import PropTypes from 'prop-types';

const CustomMarker = ({ point, isSelected, onClick }) => {
    const { name, photo } = point.properties;
    const photoUrl = photo ? `url(${photo})` : 'url("/placeholder.jpg")';

    return (
        <div className="relative flex flex-col items-center" onClick={onClick}>
            <div
                className={`w-12 h-12 rounded-full border-4 ${isSelected ? 'border-blue-500' : 'border-gray-300'} bg-white`}
                style={{ backgroundImage: photoUrl, backgroundSize: 'cover' }}
            />
            <div className={`mt-2 ${isSelected ? 'text-lg' : 'text-sm'}`}>
                {name}
            </div>
        </div>
    );
};

CustomMarker.propTypes = {
    point: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default CustomMarker;