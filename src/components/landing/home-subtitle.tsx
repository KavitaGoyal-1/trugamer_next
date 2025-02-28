
interface IHomeSubtitle{text:string}
const HomeSubtitle = ({text}:IHomeSubtitle) => {
  return <h2 className='mb-0 md:mb-0 font-bold text-[24px] md:text-[25px] sm:text-3xl	md:text-4xl	lg:text-[36px] justify-self-start capitalize'>{text}</h2>
    
}
export default HomeSubtitle