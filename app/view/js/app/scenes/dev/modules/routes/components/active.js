import React from "react"
import {SelectivelyActive} from "../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../components/selectivelyActive/components";
import ContentSection, {ContentSectionHeader} from "../../../../../components/page/content/section";
import RouteConfiguration from "./route/configuration";
import {routes as availableRoutes} from "../../../../../../path/resolution";

let RouteContainerTitle = ({title, description, typeClassname}) =>
    <div className={"title--wrapper configuration--title--wrapper route--configuration--title--wrapper"}>
        <div className={`title configuration--title route--configuration--${typeClassname}--title`}>
            {title}
        </div>
        <div className={'description'}>{description}</div>
    </div>;

const ActiveRouteContainer = ({routes, isList, typeClassname, title, description}) => {
    
    let routeArr = isList ? routes : Object.entries(routes);
    return (
        <div className={`route--configuration--${typeClassname}`}>
            <RouteContainerTitle title={title} description={description} typeClassname={typeClassname} />
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

const RouteContainer = ({routes, title, description}) => {
    const isList      = Array.isArray(routes);
    let typeClassname = isList ? 'list' : 'container';
    return (
        <SelectivelyActive className={`wrapper route--container--wrapper`} matchTarget={target => target.classList.contains('configuration--title')}>
            <ActiveComponent component={ActiveRouteContainer}
                             routes={routes}
                             title={title}
                             description={description}
                             typeClassname={typeClassname}
                             isList={isList} />
            <InactiveComponent component={RouteContainerTitle}
                               typeClassname={typeClassname}
                               description={description}
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
        const header        = <ContentSectionHeader className={'dev--scene--toggle'} title="Routes" />;
        Object.entries(routes)
              .forEach(
                  ([name, config]) => {
                      if (!isNaN(parseInt(name))) {
                          numericRoutes.push(config);
                      } else {
                          namedRoutes[name] = config;
                          availableRoutes[name] && (publicRoutes[name] = config)
                      }
                  });
        return (
            <ContentSection sectionRef={this.props.activeElRef} className={'dev--component routes--container'} header={header}>
                <div className="route--container--container">
                    <RouteContainer title={"Unnamed Routes"}
                                    routes={numericRoutes}
                                    description={"Paths that are handled by the backend but aren't referenced by name"} />
                    <RouteContainer title={"Named Routes"}
                                    routes={namedRoutes}
                                    description={"Routes that are named (don't necessarily have an associated URL)"} />
                    <RouteContainer title={"Public Routes"}
                                    routes={publicRoutes}
                                    description={"Routes that are referenced by the front-end"} />
                </div>
            </ContentSection>
        )
    }
}