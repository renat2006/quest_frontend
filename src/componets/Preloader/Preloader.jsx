import {Spinner} from "@nextui-org/react";


const Preload = ({ isLoading, children }) => {
    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="flex items-center flex-col space-x-2 gap-3">


                        <Spinner label="Идёт загрузка квеста..." color="primary" size="lg" labelColor="primary"/>
                    </div>
                </div>
            )}
            <div className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </div>
        </div>
    );
};

export default Preload;
