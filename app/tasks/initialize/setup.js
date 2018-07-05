import replace from "replace-in-file";

//String replace on standard app properties
export function replaceAppBoilerplateConstants(app, appPath) {
    if (!app.namespace) return;
    let srcPath       = app.paths.src || `${appPath}/src`;
    let configPath    = app.paths.CONFIG || `${appPath}/config`;
    const options     = {
        files: [`${srcPath}/**/*`, configPath + '/config.php'],
        from:  new RegExp('WANGHORN', 'g'),
        to:    app.namespace,
    };
    const onCompleted = changes => console.log('Replaced the default namespace in :\n\t', changes.join(',\n\t'));
    return replace(options).then(onCompleted)
                           .catch(error => console.error('Error occurred:', error));
}