import React from 'react';
import ReactDOM from 'react-dom';

function TestComponent(props) {
	console.log(props.test);
	return (
		<div>
			{props.test}<br />
			also hello world
		</div>
	);
}

ReactDOM.render(
	<TestComponent test={window.props.test} />,
	window.react_mount,
)