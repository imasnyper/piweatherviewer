import React from 'react';

export function Photos(props) {
	if (props.photos[0] === null) {
		return null;
	}
	let imgStyle = 	{ 	
						maxWidth: props.width
					}
	return (
		<div className='photo'>
			{props.photos.map((elem, i) => {
				return (<a title={elem.name} key={i}>
						<img 
							src={elem.location}  
							alt={elem.name}
							style={ imgStyle }>
						</img>
					   </a>)
			})}
		</div>
	)
}