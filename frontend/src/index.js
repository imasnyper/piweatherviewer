import React from 'react';
import ReactDOM from 'react-dom';

function TestComponent(props) {
	return (
		<div>
			{this.props.test}
		</div>
	);
}

ReactDOM.render(
	<TestComponent {...window.props} />,
	window.react_mount,
)