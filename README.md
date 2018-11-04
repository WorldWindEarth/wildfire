# The Wildfire Management Tool - WMT 2.0
An HTML5/JavaScript geo-browser with weather forecasts and wildland fire potentials built with the NASA WorldWind SDK.

### Contents
- [Overview](#overview)
- [Software Archtecture](#software-architecture)
- [Software Development Plan](#software-development-plan)

* * *

# Overview
TODO

* * *

# Software Architecture
TODO

* * *

# Software Development Plan
## Introduction
### Purpose
The purpose of the Software Development Plan is to gather all information necessary to control the project. It describes the approach to the development of the software and is the top-level plan generated and used by managers to direct the development effort.

### Scope 
This Software Development Plan describes the overall plan to be used by the WMT 2.0 project, including deployment of the product. The details of the individual iterations will be described in the Iteration Plans.
The plans as outlined in this document are based upon the product requirements as defined in the Vision Document.

## Project Overview

### Project Purpose, Scope and Objectives
The primary goal is to create a WMT application that is web browser based, and platform and device agnostic. 

For more information see [Vision and Scope Document](https://bitbucket.org/emxsys/wildfire-management-tool-web/wiki/Vision%20and%20Scope)

### Project Deliverables

1. [WMT 2.0 Web Application](https://worldwind.earth/wildfire)
2. [WMT Wiki with User Guide and Developer Guide](https://github.com/WorldWindEarth/wildfire/wiki)
3. [WMT open-source repository with MIT license](https://github.com/WorldWindEarth/wildfire)

## Project Organization

### Organizational Structure ###
Team Member | Description | Roles
----------- | ----------- | ---------
Bruce Schubert | Project Sponsor, Author | Analyst, Architect, Developer, Tester, Project Manager

### External Interfaces ###
Stakeholder | Title | Description
----------- | ------| -----------
Doug Campbell   | FBAN, USFS (retired)             | Wildland Fire Behavior Domain Expert
Marc Castellnou | Chief, Catalonia Fire Department | Wildland Fire Behavior Domain Expert
Patrick Hogan   | Project Manager, NASA (retired)  | Web WorldWind Champion

## Management Process

### Project Estimates ###

#### Phase Plan ####
##### [Inception Phase](https://github.com/WorldWindEarth/wildfire/projects/1) #####
* Explorer-based proof-of-concept
* Digital Ocean IaaS 

##### [Elaboration Phase](https://github.com/WorldWindEarth/wildfire/projects/2) #####
Iteration | Description | Deadline
--------- | ----------- | ---------
[E1](https://github.com/WorldWindEarth/wildfire/milestone/1?closed=1) | *Evolutionary Prototype and supporting environment* | Nov, 10, 2018

##### [Construction Phase](https://github.com/WorldWindEarth/wildfire/projects/3) #####
Iteration | Description | Deadline
--------- | ----------- | ---------
[C1](https://github.com/WorldWindEarth/wildfire/milestone/2) | *Sprint 1 - Fire Lookout outputs* | Nov, 16, 2018
[C2](https://github.com/WorldWindEarth/wildfire/milestone/3) | *Sprint 2 - Wildfire outputs* | TBD


##### [Transistion Phase](https://github.com/WorldWindEarth/wildfire/projects/4) #####
Iteration | Description | Deadline
--------- | ----------- | ---------
T1 | WMT Release - Version 2.0.0 | TBD


### Project Monitoring
#### Budget Control
The project is constrained by the Windows Azure monthly developer credits. The project manager must monitor the Azure account to ensure the usage limits are not exceeded.
 
#### Quality Control
Defects will be recorded in project's [Issue Tracker](https://bitbucket.org/emxsys/wildfire-management-tool-web/issues), as will feature requests, proposals, and tasks. Tasks will be tagged with the milestone corresponding the the associated iteration/sprint.

All [commits](https://bitbucket.org/emxsys/wildfire-management-tool-web/commits/all) should undergo peer review. The reviewing party should approve/disapprove the changes via the individual Commits review page. 

## Annexes
This project will follow the Rational Unified Process (RUP) for Small Projects process.

See also the [Software Design Guidelines][design]
