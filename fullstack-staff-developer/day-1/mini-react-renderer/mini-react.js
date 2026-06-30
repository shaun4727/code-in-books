// 1. Construct Virtual DOM Elements
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			// Automatically turn text strings into descriptive text VNodes
			children: children.map((child) => (typeof child === 'object' ? child : createTextElement(child))),
		},
	};
}

function createTextElement(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: [],
		},
	};
}

// 2. Instantiate Concrete HTML Elements from vNodes
function createDomElement(vNode) {
	const dom = vNode.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(vNode.type);

	// Apply properties and attributes to the node
	Object.keys(vNode.props)
		.filter((key) => key !== 'children')
		.forEach((name) => {
			dom[name] = vNode.props[name];
		});

	return dom;
}

// 3. Recursive Engine: Tree Reconciliation & Structural Diffing
function reconcileElements(parentDom, oldVNode, newVNode, domNode) {
	// Case 1: Initial Render (No older tracking pointer exists)
	if (!oldVNode) {
		const newDom = createDomElement(newVNode);
		newVNode.props.children.forEach((child) => reconcileElements(newDom, null, child));
		parentDom.appendChild(newDom);
		return newDom;
	}

	// Case 2: Node Type Mismatch -> Safely destroy and reconstruct subtree
	if (oldVNode.type !== newVNode.type) {
		const newDom = createDomElement(newVNode);
		newVNode.props.children.forEach((child) => reconcileElements(newDom, null, child));
		parentDom.replaceChild(newDom, domNode);
		return newDom;
	}

	// Case 3: Match confirmed -> Sync properties and recursively evaluate children
	if (oldVNode.type === newVNode.type) {
		// Update changed/new props
		Object.keys(newVNode.props)
			.filter((key) => key !== 'children')
			.forEach((name) => {
				if (oldVNode.props[name] !== newVNode.props[name]) {
					domNode[name] = newVNode.props[name];
				}
			});

		// Clear removed props
		Object.keys(oldVNode.props)
			.filter((key) => key !== 'children')
			.forEach((name) => {
				if (!(name in newVNode.props)) {
					domNode[name] = '';
				}
			});

		// Diff children array structures
		const oldChildren = oldVNode.props.children;
		const newChildren = newVNode.props.children;
		const maxLen = Math.max(oldChildren.length, newChildren.length);

		const currentDomChildren = Array.from(domNode.childNodes);

		for (let i = 0; i < maxLen; i++) {
			if (i >= newChildren.length) {
				// If old child exists but new tree doesn't have it -> Remove element
				domNode.removeChild(currentDomChildren[i]);
			} else {
				reconcileElements(domNode, oldChildren[i], newChildren[i], currentDomChildren[i]);
			}
		}
		return domNode;
	}
}

// Global reference system tracking the application tree state
let rootVNode = null;
let targetContainer = null;

const MiniReact = {
	createElement,
	render(vNode, container) {
		targetContainer = container;
		rootVNode = reconcileElements(container, rootVNode, vNode, container.firstElementChild);
	},
};

// --- Practical Demo Verification ---
const container = document.getElementById('root');

// Initial Paint Configuration
const initialTree = MiniReact.createElement(
	'div',
	{ id: 'app-wrapper', style: 'font-family: sans-serif;' },
	MiniReact.createElement('h1', null, 'Hello Mini-React Engine'),
	MiniReact.createElement('p', null, 'This stateful DOM element was rendered entirely from scratch.'),
);
MiniReact.render(initialTree, container);

// Emulate a swift runtime state update 2.5 seconds later
setTimeout(() => {
	const updatedTree = MiniReact.createElement(
		'div',
		{ id: 'app-wrapper', style: 'font-family: sans-serif; color: #2563eb;' },
		MiniReact.createElement('h1', null, 'Hello Mini-React Engine (Updated!)'),
		MiniReact.createElement(
			'p',
			null,
			'The diff engine successfully reconciled this specific node text without remounting the layout wrapper container!',
		),
		MiniReact.createElement('span', null, 'New dynamic inline node appended.'),
	);
	console.log('🔄 Executing atomic DOM tree update patch...');
	MiniReact.render(updatedTree, container);
}, 2500);
