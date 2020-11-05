import React from "react";
import {mount} from "enzyme";
import AddTeam from "../components/util/AddTeam";
import {TeamsProvider} from "../components/contexts/TeamsContext";

describe('AddTeam', () => {
    let wrapper;

    beforeAll(() => {
        wrapper = mount(
            <TeamsProvider>
                <AddTeam/>
            </TeamsProvider>);
    });

    it('should render a <AddTeam /> component', function () {
        expect(wrapper.find('form').length).toEqual(1);
    });

    it('should render input fileds', function () {
        expect(wrapper.find('input[name="teamName"]').length).toEqual(1);
        expect(wrapper.find('input[name="id"]').length).toEqual(1);
        expect(wrapper.find('input').length).toEqual(2);
    });
})