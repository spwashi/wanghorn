import React from "react"
import {ConfigurationAttribute} from "../../../components/configuration";
import {SelectivelyActive} from "../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../components/selectivelyActive/components";
import ContentSection from "../../../../../components/page/content/section";
import AttrValue from "../../../components/configuration/attribute/value";

let RouteConfiguration     = ({route}) =>
    <div className="route--configuration">
        {Object.entries(route)
               .map(([attr, value]) => {
                   if (attr === "parameters" && Array.isArray(value) && !value.length) {
                       return;
                   } else if (attr === "requestDescriptor") {
                       return (
                           !value || typeof value !== "object" ? null
                                                               :
                           <ConfigurationAttribute title={attr.replace(/([A-Z][a-z])/g, ' $1').replace(/_/g, ' ').trim()} key={attr} ownerType={"route"} attribute={attr}>
                               <div>
                                   <table>
                                       <tbody>
                                       {
                                           Object.entries(value).map(([attr, val]) =>
                                                                         val === null || Array.isArray(val) && !val.length ? undefined
                                                                                                                           :
                                                                         <tr key={attr}>
                                                                             <td className={"attribute"}>{attr.replace(/_/g, ' ')}</td>
                                                                             <td className={"value"}><AttrValue value={val} attr={attr} /></td>
                                                                         </tr>)
                                       }
                                       </tbody>
                                   </table>
                               </div>
                           </ConfigurationAttribute>
                       )
                   }
                   return <ConfigurationAttribute title={attr.replace(/([A-Z][a-z])/g, ' $1').replace('_', ' ').trim()} key={attr} ownerType={"route"} attribute={attr} value={value} />;
               })}
    </div>;
let RouteContainerTitle    = ({title, typeClassname}) =>
    <div className={`title configuration--title route--configuration--${typeClassname}--title`}>
        {title}
    </div>;
const ActiveRouteContainer = ({routes, isList, typeClassname, title}) => {
    
    let routeArr = isList ? routes : Object.entries(routes);
    return <div className={`route--configuration--${typeClassname}`}>
        <RouteContainerTitle title={title} typeClassname={typeClassname} />
        {
            routeArr.map((item, index) => {
                let name = '', route;
                if (isList) {
                    route = item;
                } else {
                    [name, route] = item;
                }
                let path =
                        (route.requestDescriptor ? route.requestDescriptor.original : '')
                            .split('/')
                            .map(pathPart => {
                                let variable = /({[a-zA-Z0-9_]+})/.exec(pathPart);
                                console.log(variable);
                                if (variable) return variable[0];
                                return pathPart;
                            })
                            .join('/');
                
                let RouteName = () =>
                    <div key='name' className="route--identifier">
                        <div className="name route--name">{name}</div>
                        <div className="path route--path">{path}</div>
                    </div>;
                
                return (
                    <SelectivelyActive className="route--wrapper">
                        <ActiveComponent component={props => [<RouteName key='route-name' />, <RouteConfiguration {...props} key='route-configuration' />]} key='configuration' route={route} />
                        <InactiveComponent component={RouteName} />
                    </SelectivelyActive>
                )
            })
        }
    </div>;
};

const RouteContainer = ({routes, title}) => {
    const isList      = Array.isArray(routes);
    let typeClassname = isList ? 'list' : 'container';
    return (
        <SelectivelyActive className={`wrapper route--container--wrapper`} matchTarget={target => target.classList.contains('configuration--title')}>
            <ActiveComponent component={ActiveRouteContainer}
                             routes={routes}
                             title={title}
                             typeClassname={typeClassname}
                             isList={isList} />
            <InactiveComponent component={RouteContainerTitle}
                               typeClassname={typeClassname}
                               title={title} />
        </SelectivelyActive>
    )
};

export class ActiveRoutesScene extends React.Component {
    render() {
        const routes        = this.props.routes;
        const numericRoutes = [];
        const publicRoutes  = {};
        const namedRoutes   = {};
        Object.entries(routes)
              .forEach(
                  ([name, config]) => {
                      if (!isNaN(parseInt(name))) {
                          numericRoutes.push(config);
                      } else {
                          namedRoutes[name] = config;
                          if (config.isPublic) {
                              publicRoutes[name] = config;
                          }
                      }
                  });
        return (
            <ContentSection sectionRef={this.props.activeElRef} className={'dev--component routes--container'}>
                <h2 className={`title routes--container--title`}>Routes</h2>
                <div className="route--container--container">
                    <RouteContainer title={"Unnamed Routes"} routes={numericRoutes} />
                    <RouteContainer title={"Named Routes"} routes={namedRoutes} />
                    <RouteContainer title={"Client-Side Routes"} routes={publicRoutes} />
                </div>
            </ContentSection>
        )
    }
}