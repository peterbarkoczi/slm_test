import React from "react";
import { shallow } from "enzyme";
import App from "../App";

describe('App', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<App />);
    })

    it('should render a <div />', function () {
        expect(wrapper.find('div.App').length).toEqual(1);
    });

    it('should render a <Header />', function () {
        expect(wrapper.find('Header').length).toEqual(1);
    });

})