// import CSVReader from 'react-csv-reader'

// export default function CSVReaderComp() {
//     const papaparseOptions = {
//         header: true,
//         dynamicTyping: true,
//         skipEmptyLines: true,
//         transformHeader: header =>
//             header
//                 .toLowerCase()
//                 .replace(/\W/g, '_')
//     }

//     const handleForce = (data) => {
//         console.log(data);
//     }
//     const handleDarkSideForce = (data) => {
//         console.log(data);
//     }

//     return (
//         <div className="my-2">
//             <label className='fs-4 mb-2'>Upload CSV File</label>
//             <CSVReader
//                 cssClass="csv-reader-input"
//                 // label="Upload CSV File"
//                 onFileLoaded={handleForce}
//                 onError={handleDarkSideForce}
//                 parserOptions={papaparseOptions}
//                 inputId="ObiWan"
//                 inputName="ObiWan"
//                 inputStyle={{ color: 'red' }}
//             />
//         </div>
//     );
// }
