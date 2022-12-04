import React from 'react'

function HOCTest(SomeComp) {
    let NewComponent = props => {
        return (
            <SomeComp {...props} />
        )
    }

  return ( NewComponent
    // <div>
    //     HOCTest
    //     <SomeComp {...props} />
    // </div>
  )
}

// function HOCTest(SomeComp) {
//     class NewComponent extends React.Component {

//         componentDidMount() {
//             console.log(this.props);
//         }

//         render() {
//             return <SomeComp {...this.props} />;
//         }
//     }

//     return NewComponent
// }

function SomeReuseableComponent(props) {
    return (
        <div>Dit is {props.name}</div>
    )
}

export default HOCTest(SomeReuseableComponent)