import React from "react"
import {Link} from "react-router-dom"
import {LinkContainer, LinkItem} from "../../../components/navigation/index";
import {ABOUT_PATH, APP_HOME, TOPICS_PATH} from "../../paths";

const Navigation =
          <nav className="main main--navigation navigation">
              <LinkContainer>
                  <LinkItem to={APP_HOME} as="HOME" />
                  <LinkItem to={ABOUT_PATH} as="ABOUT" />
                  <LinkItem to={TOPICS_PATH} as="TOPICS" />
              </LinkContainer>
          </nav>;

export default Navigation