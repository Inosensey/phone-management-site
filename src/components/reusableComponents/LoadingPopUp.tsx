interface props {
  message: string
  isLoading: boolean
}

const LoadingPopUp = ({message, isLoading}:props) => {
  return (
    <div className={`${isLoading ? "fixed" : "hidden"} top-0 left-0 z-[100] bg-black/[0.5] w-screen h-screen flex justify-center items-center text-white`}>
      <div className='bg-primary flex flex-col items-center justify-center rounded-md min-w-[300px] max-w-[450px] phone:w-11/12 laptop:w-9/12'>
        <p className='text-center py-4 px-6 font-semibold text-sm'>{message}</p>
      </div>
    </div>
  )
}

export default LoadingPopUp