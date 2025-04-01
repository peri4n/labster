import { Dialog, DialogContent } from '@mui/material';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  open: boolean;
  handleClose: () => void;
}

function FileUploadDialog({ open, handleClose }: FileUploadProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </DialogContent>
    </Dialog>
  );
}

export default FileUploadDialog;
