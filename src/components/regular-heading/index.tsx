interface IRegularHeading{text:string}
const RegularHeading = ({text}: IRegularHeading) => {
    return <h2 className='font-bold text-3xl md:text-4xl justify-self-center md:justify-self-start capitalize'>{text}</h2>
}

export default RegularHeading