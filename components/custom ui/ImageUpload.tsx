// import { CldUploadWidget, CldUploadWidgetResults } from 'next-cloudinary';
// import { Button } from '../ui/button';
// import { Plus, Trash } from 'lucide-react';
// import Image from 'next/image';

// interface ImageUploadProps {
//     value: string[];
//     onChange: (value: string) => void;
//     onRemove: (value: string) => void;
// }
// const ImageUpload: React.FC<ImageUploadProps> = ({
//     onChange,
//     onRemove,
//     value,
// }) => {

//     const onUpload = (result: CldUploadWidgetResults) => {
//         if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
//           onChange(result.info.secure_url as string);
//         }
//       };
//   return (
//     <div>
//         <div className="mb-4 flex flex-wrap items-center gap-4">
//             {value.map((url) => (
//                 <div key={url} className="relative w-[200px] h-[200px]">
//                     <div className='absolute top-0 right-0 z-10'>
//                         <Button onClick={() => onRemove(url)} size="sm" className='bg-red-1 text-white'>
//                             <Trash className='h-4 w-4'/>
//                         </Button>
//                     </div>
//                     <Image
//                         src={url}
//                         alt="collection"
//                         className='object-cover rounded-lg'
//                         fill
//                 />
//                 </div>
//             ))}
//         </div>
//         <CldUploadWidget uploadPreset="sondacut" onUpload={onUpload}>
//             {({ open }) => {
//                 return (
//                 <Button onClick={() => open()} className="bg-grey-1 text-white">
//                     <Plus className='h-4 w-4 mr-2'/>
//                     Upload Image
//                 </Button>
//                 );
//             }}
//         </CldUploadWidget>
//     </div>
    
//   )
// }

// export default ImageUpload

import { CldUploadWidget, CldUploadWidgetResults } from 'next-cloudinary';
import { Button } from '../ui/button';
import { Plus, Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    onRemove,
    value,
}) => {

    const onUpload = (result: CldUploadWidgetResults) => {
        if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
          onChange(result.info.secure_url as string);
        }
    };
    
    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
        e.preventDefault(); // Prevent form submission
        onRemove(url);
    };
    
    const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>, open: () => void) => {
        e.preventDefault(); // Prevent form submission
        open();
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px]">
                        <div className='absolute top-0 right-0 z-10'>
                            <Button 
                                onClick={(e) => handleRemove(e, url)} 
                                type="button" // Explicitly set type to button
                                size="sm" 
                                className='bg-red-1 text-white'
                            >
                                <Trash className='h-4 w-4'/>
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt="collection"
                            className='object-cover rounded-lg'
                            fill
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget uploadPreset="sondacut" onUpload={onUpload}>
                {({ open }) => {
                    return (
                    <Button 
                        onClick={(e) => handleUploadClick(e, open)} 
                        type="button" // Explicitly set type to button
                        className="bg-grey-1 text-white"
                    >
                        <Plus className='h-4 w-4 mr-2'/>
                        Upload Image
                    </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload