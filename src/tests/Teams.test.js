import React from "react";
import {mount} from "enzyme";
import Teams from "../components/pages/team/Teams";
import {TeamsProvider} from "../components/contexts/TeamsContext";

describe('Teams', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
            <TeamsProvider>
                <Teams/>
            </TeamsProvider>);
    });

    it('should render a page title', function () {
        expect(wrapper.find('#teamsTitle').length).toEqual(1);
    });

    it('should render a <Teams /> component', function () {
        expect(wrapper.find('.team').length).toEqual(11);
    });

    it('should render <AddTeam /> component', function () {
        expect(wrapper.find('#addNewTeam').length).toEqual(0);
        wrapper.find('#addNewTeamButton').simulate('click');
        expect(wrapper.find('#addNewTeam').length).toEqual(1);
    });
})