import React from "react";
import { shallow } from "enzyme";
import Header from "../components/Header";

describe('Header', () => {
   let wrapper;
   
   beforeEach(() => {
       wrapper = shallow(<Header />);
   });

    it('should render a header container', function () {
        expect(wrapper.find('div.header').length).toEqual(1);
    });

    it('should render a logo container', function () {
        expect(wrapper.find('div.logo').length).toEqual(1);
    });

    it('should render a menu container', function () {
        expect(wrapper.find('div.menu').length).toEqual(1);
    });

    it('should render a login container', function () {
        expect(wrapper.find('div.login').length).toEqual(1);
    });

    it(`should render four <Link />'s`, function () {
        expect(wrapper.find('Link').length).toEqual(4);
    });

    it(`should render two <button />'s`, function () {
        expect(wrapper.find('button').length).toEqual(2);
    });

});