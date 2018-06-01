import React from "react"
import Dropzone from 'react-dropzone'
import axios from 'axios'
import bind from 'bind-decorator'
import {Field} from "../../../../../components/form/field/field";
import {DefaultPropertyField} from "../../../../scenes/sm/components/form/creation/components/field/smEntity/default";
import {getURI} from "../../../../../path/resolution";

const FileMessage =
          ({isPrimingUpload, didPrimeUpload, files}) => {
              const filenameString = files.map(file => file.name).join(', ');
        
              if (isPrimingUpload) {return `...uploading files ${filenameString}`;}
        
              if (didPrimeUpload) {return `Uploaded ${filenameString}`;}
        
              return 'Upload file'
          };

export class FileUploadField extends React.Component {
    static propTypes = {...DefaultPropertyField.propTypes};
           state     = {files: [], isPrimingUpload: false, didPrimeUpload: false};
    
    constructor(props) {
        super(props);
        const files = [];
        if (props.value) files.push(files);
        status = {files}
    }
    
    render() {
        let className = 'file-upload-input';
        if (this.state.didPrimeUpload) className += ' has-primed-upload';
        if (this.state.isPrimingUpload) className += ' is-priming-upload';
        
        const dropZone =
                  <Dropzone name={this.props.name} style={{}}
                            className={className}
                            activeClassName={'file-upload-input file-upload-input__active'}
                            acceptClassName={'file-upload-input file-upload-input__accept'}
                            onDropAccepted={this.onDropAccepted}><FileMessage isPrimingUpload={this.state.isPrimingUpload}
                                                                              didPrimeUpload={this.state.didPrimeUpload}
                                                                              files={this.state.files} /></Dropzone>;
        return <Field title={this.props.title}
                      name={this.props.name}
                      message={this.props.message}
                      input={dropZone} />
    }
    
    @bind
    onDropAccepted(files) {
        this.setState({files, isPrimingUpload: true},
                      () => {
                          const formData = new FormData;
            
                          files.forEach(file => formData.append(file.name, file));
            
                          axios.post(getURI('file--prime_upload'),
                                     formData,
                                     {headers: {'Content-Type': 'multipart/form-data'}})
                               .then(resp => {
                                   const {data} = resp;
                                   this.setState({
                                                     isPrimingUpload: false,
                                                     didPrimeUpload:  data.success
                                                 });
                                   const checkPropertyValidity = schematic => {
                                       if (!data.message) return {message: JSON.stringify(data), status: false};
                                       const message = data.message;
                                       const status  = data.success;
                                       return {message, status};
                                   };
                                   this.props.onValueChange(data.id, checkPropertyValidity);
                                   return console.log(data);
                               });
                      })
    }
}