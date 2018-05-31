<?php


namespace WANGHORN\Controller\File;

use Sm\Application\Application;
use Sm\Controller\Controller;
use Upload\File;
use WANGHORN\Controller\AppController;


class FileController extends AppController {
    protected $uploadLocation = APP__FILE_UPLOAD_PATH;
    
    public function proxy(): Controller {
        return $proxy = new FileControllerProxy($this);
    }
    public function getFilesystemStorage(): \Upload\Storage\FileSystem {
        return new \Upload\Storage\FileSystem($this->uploadLocation);
    }
    
    public function prime() {
        $files = $_FILES ?? [];
        $resp  = [ 'success' => true, 'message' => [] ];
        
        $image_mimes = [ 'image/png', 'image/jpeg', 'image/gif' ];
        $other_mimes = [ 'text/csv', 'text/plain' ];
        $mime_types  = array_merge($image_mimes, $other_mimes);
        
        foreach ($files as $id => $file_details) {
            $status          = $this->uploadFile($id, $file_details['name'], $mime_types);
            $resp['success'] = !$resp['success'] ? false : $status['success'] ?? false;
            
            if (count($files) === 1) {
                $resp = $status;
            } else {
                $resp['message'][ $id ] = $status;
            }
        }
        
        return $resp;
    }
    
    protected function uploadFile($file_id, string $original_filename = null, array $mimeTypes = [ 'image/png' ], $maxSize = '5M', $minSize = 0) {
        
        $original_filename = $original_filename ?? $file_id;
        $storage           = $this->getFilesystemStorage();
        $file              = new File($file_id, $storage);
        
        $file->setName(date('dmy') . '__' . uniqid());
        $file->addValidations([ new \Upload\Validation\Mimetype($mimeTypes), new \Upload\Validation\Size($maxSize, $minSize) ]);
        $data = $this->getFileData($file, $original_filename);
        try {
            $file->upload();
            $this->addFileToSession($data);
            return [
                'success' => true,
                'message' => 'Successfully uploaded file',
                'name'    => $data['name'],
            ];
        } catch (\Exception $e) {
            $parsed_errors = $this->getFileErrors($file);
            
            return [
                'success' => false,
                'message' => $parsed_errors,
                'data'    => $this->app->environmentIs(Application::ENV_DEV) ? $data : null,
            ];
        }
    }
    
    protected function getFileData(File $file, $original_filename): array {
        return [
            'name'          => $file->getNameWithExtension(),
            'readable_name' => $original_filename,
            'extension'     => $file->getExtension(),
            'mime'          => $file->getMimetype(),
            'size'          => $file->getSize(),
            'md5'           => $file->getMd5(),
            'dimensions'    => $file->getDimensions(),
        ];
    }
    protected function addFileToSession($data): void {
        $_SESSION['files']                 = $_SESSION['files'] ?? [];
        $_SESSION['files'][ $data['md5'] ] = $data;
    }
    protected function getFileErrors(File $file, $do_format = true): array {
        $errors        = $file->getErrors();
        $parsed_errors = [];
        foreach ($errors as $k => $msg) {
            switch ($msg) {
                case 'Invalid mimetype':
                    $parsed_errors[ $k ] = 'Invalid File Type';
                    break;
                case 'Invalid file size':
                    $parsed_errors[ $k ] = 'File is an invalid size';
                    break;
                default:
                    $parsed_errors[ $k ] = 'Could not upload file';
            }
        }
        
        if ($do_format) return count($parsed_errors) === 1 ? $parsed_errors[0] : json_encode($parsed_errors);
        
        return $parsed_errors;
    }
}