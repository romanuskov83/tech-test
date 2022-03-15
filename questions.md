## What is the difference between Component and PureComponent? give an example where it might break my app.

Component's shouldComponentUpdate always returns true (by default), so component is rendered every time state did change.
Pure component has default implementation of shouldComponentUpdate that compares existing state with a new one.
The comparison is shalow. It might cause problems if there are modifications deep in the object tree.

## Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

Context + ShouldComponentUpdate is dangerous because modifying context won't trigger SCU as it depends on props and state only.

It might only be dangerous for performance OR if shouldComponentUpdate used improperly (one should never rely on SCU to prevent rendering)

## Describe 3 ways to pass information from a component to its PARENT.

- Pass callback to child in props
- Use observable object parent is subscribed to. Pass the object to a child. Object should contain method performing action on an object itself (e.g. Comment.toggleLike)
- Pass context with modification methods


## Give 2 ways to prevent components from re-rendering.

- use useMemo/useCallback to memorize values/functions passed to children, so they won't recreated every time parent 'render' is called
- implement should component update returning false

## What is a fragment and why do we need it? Give an example where it might break my app.

Fragment is a spection JSX element that doesn't produce any tag in actual DOM. It is required because render should always return single (root) element and it might be convenient to return several

Using div instead:

- increases DOM size and complexity
- not possible if working with tables
- may break styles like ul > li {}

Don't really know how it breaks my app :( something about "key" property?
 
## Give 3 examples of the HOC pattern.

- observer that takes observable object as a parameter and turning object updates into wrapped component re-renders
- component that handles list pagination, search and optimization (by only showing visible elements of very long list)
- wrap components that render different data (list of comments vs list of articles) but have similar ways of acquiring that data

## what's the difference in handling exceptions in promises, callbacks and async...await.

- for promises we should always implement .then() and .catch()
- in callbacks first parameter is always err or null
- await Promise will throw if promise is resolved with an error, so we need to use try-catch

## How many arguments does setState take and why is it async.

Two

- a function that updates state. it takes old state as param and its result is merged into state
- a callback that is called once state is actually updated

It's async because setState may be called several times on a single event loop iteration. So it is an optimization to prevent multiple renders

## List the steps needed to migrate a Class to Function Component.

- replace class declaration with const MyClass = (props: MyClassProps) => {}
- replace render with return
- replace class methods with const foo = () => {}
- replace mount/unmount with useEffect({},[])
- replace componentDidUpdate with useEffect
- replace this.state / this.setState with useState
- for calculated values/callbacks use useMemo/useCallback to prevent excessive rendering of children

## List a few ways styles can be used with components.

- use global styles
- use styles imported by component (applied globally anyway)
- use CSS Modules or any other library for defining scoped styles
- uses style attribute

## How to render an HTML string coming from the server.

Use dangerouslySetInnerHTML but be aware of js-injection. So use only proven content that doesn't come from user input.