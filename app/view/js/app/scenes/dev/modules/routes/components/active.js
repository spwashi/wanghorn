import React from "react"
import {SelectivelyActive} from "../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../components/selectivelyActive/components";
import ContentSection from "../../../../../components/page/content/section";
import RouteConfiguration from "./route/configuration";

let RouteContainerTitle = ({title, typeClassname}) =>
    <div className={`title configuration--title route--configuration--${typeClassname}--title`}>
        {title}
    </div>;

const ActiveRouteContainer = ({routes, isList, typeClassname, title}) => {
    
    let routeArr = isList ? routes : Object.entries(routes);
    return (
        <div className={`route--configuration--${typeClassname}`}>
            <RouteContainerTitle title={title} typeClassname={typeClassname} />
            {
                routeArr.map((item, index) => {
                    let name = '', route;
                    if (isList) {
                        route = item;
                    } else {
                        [name, route] = item;
                    }
                    return <RouteConfiguration key={index} route={route} name={name} />
                })
            }
        </div>);
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