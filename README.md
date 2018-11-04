# The Wildfire Management Tool - WMT 2.0
An HTML5/JavaScript geo-browser with weather forecasts and wildland fire potentials built with the NASA WorldWind SDK.

### Contents
- [Overview](#overview)
- [Vision and Scope](#vision-and-scope)
- [Software Archtecture](#software-architecture)
- [Software Development Plan](#software-development-plan)

* * *

# Overview
## Introduction
The Wildfire Management Tool (WMT) is a web application and REST server that work together to display the potential behavior of a wildfire in your web browser on your mobile device or desktop computer.

WMT (v1.0) was the first place award winner among the professional teams in the NASA World Wind Europa Challenge 2015 held at the FOSS4GE conference in Como, Italy.

WMT is free! It has been granted a permissive license (MIT) to encourage and promote its reuse in other applications and projects. Developers are encouraged to clone or fork this repository. Instructions for building the WMT are found in the wiki's Developer Guide. 
The purpose of the WMT is to:

- Improve the safety of firefighters and ensure the effective use of firefighting resources.
- Promote the principles and tenets of Campbell Prediction System (CPS) for predicting wildfire behavior.
- Provide an extensible and reusable application platform for NASA Web WorldWind applications.

## Target Audience and Outreach
* Wildland Firefighters
* Land Managers
* Homeowners in the Wildland Urban Interface (WUI)

WMT has been designed with direct input from several agency representatives, fire chiefs, training officers, fire behavior analysts and domain experts. The outreach is expected to go beyond the firefighting community and out into the general public. Fire prevention personnel intend for the web application to advise and educate homeowners who live in the WUI and are exposed to the risk of wildfires.

## Project Overview
The issue at hand is how to convey spatiotemporal fire behavior information effectively and efficiently. Fire behavior is the manner in which a fire reacts to the influences of fuel, weather, and topography. 

** Fire Behavior Nomenclature **

![FireBehaviorNomenclature.png](https://bitbucket.org/repo/X96p7y/images/2629791881-FireBehaviorNomenclature.png)

* Figure 1. Basic Fire Behavior Nomenclature

Figure 1 depicts some of the named components of a wildfire. A wildfire is a large, destructive fire in the wildland that spreads quickly over woodland or brush.  Note that not all wildland fires are "wildfires". There are "prescribed fires" which are planned, controlled burns used to remove hazardous fuels or improve the habitat. And there are "backfires" set by firefighters to consume the fuel in the path of a wildfire.  

### The Problem: Conveying Fire Behavior

![HaulChart.png](https://bitbucket.org/repo/X96p7y/images/131419470-HaulChart.png)

* Figure 2. The Haul Chart

The Haul Chart, seen in figure 2, is the existing tool used today for depicting fire behavior information. The problem with this display is that it is point based for a single point in time, and for a single geographical location. It's difficult to view the fire behavior in the context of several locations at one time. It's also lacking flanking fire behavior. Many users consider the Haul Chart too complex for their needs; adding more information to the graphic would be detrimental.

### **The Idea and Proposed Solution**
The WMTweb software project has two significant goals, the Wildfire Diamond and the Wildfire Profile. Both which are original ideas born of this project; each which strive to improve the effectiveness of communicating spatiotemporal fire behavior information to those in need.

![WMTweb-BusinessObjectives.png](https://bitbucket.org/repo/X96p7y/images/1781429500-WMTweb-BusinessObjectives.png)

* Figure 3. High Level Requirements diagram

Fig. 3 depicts the Wildfire Diamond and Wildfire Profile requirements. WMTweb v1.0, developed for the NASA World Wind Europa Challenge 2015, satisfies the Wildfire Diamond goal. The Wildfire Profile will be manifest in a future release.

#### **Wildfire Diamond Symbology**

WMTweb introduces a proof-of-concept Wildfire Diamond symbol to the wildland firefighting community. The Wildfire Diamond conveys wildland fire behavior information at a point of interest via a color-coded diamond similar to the NFPA-704 "Fire Diamond".

![WMTweb-WildfireDiamond.png](https://bitbucket.org/repo/X96p7y/images/415007800-WMTweb-WildfireDiamond.png)

* Figure 4. Proposed Wildfire Diamond symbol

The objective is to make an informative, but simplistic symbol for depicting fire behavior information. 
This symbol represents the potential fire behavior at the point at which it is positioned on the globe. The symbol in Fig. 4 is comprised of four quadrants, each one representing one of the four main parts of a wildfire: the head, left and right flanks, and the heal. Each quadrant is color coded to indicate the severity of that part of the fire.  The colors are described in Table 1.

Intensity| Flames |Color | Description
---------|--------|------|------------  
LOW      | 0-1’   | Blue |Fire will burn and will spread however it presents very little resistance to control and direct attack with firefighters is possible. 
MODERATE | 1’-3’   | Green| Fire spreads rapidly presenting moderate resistance to control but can be countered with direct attack by firefighters. 
ACTIVE   | 3’-7’   | Tan  | Fire spreads very rapidly presenting substantial resistance to control. Direct attack with firefighters must be supplemented with equipment and/or air support. 
VERY ACTIVE | 7’-15’ | Magenta | Fire spreads very rapidly presenting extreme resistance to control. Indirect attack may be effective. Safety of firefighters in the area becomes a concern. 
EXTREME  | >15’   | Red | Fire spreads very rapidly presenting extreme resistance to control. Any form of attack will probably not be effective. Safety of firefighters in the area is of critical concern. 

* Table 1. Fire Behavior Adjectives and Color Codes

In WMTweb, this symbol reacts dynamically to the ever changing weather and solar conditions by changing the colors in its quadrants to reflect the given conditions.  Multiple symbols can be arrayed on the globe such that the user can visualize the stability, or instability of the entire fireground. 

The simplicity of the symbol belies its significance and complexity. Exposing the flanking and backing (heal) fire behavior predictions is a new concept. So much emphasis has traditionally been placed on the head of the fire, but it is at the flanks and heal where the firefighters are generally working. Thus being able to anticipate the changes in these areas is important for the safety of firefighters.

### **Fire Lookouts**
![Fire Lookouts Figure n.png](https://bitbucket.org/repo/X96p7y/images/369778668-Fire%20Lookouts%20Figure%20n.png)

* Figure 5. Fire Lookouts arrayed on the terrain

Fire Lookouts are spatiotemporal markers you drop on to the globe. A Fire Lookout downloads a point weather forecast for its location and computes the fire behavior from the weather, terrain, solar radiation and a fuel model. The Fire Lookout displays fire behavior data using the new Wildfire Diamond symbology, seen in figure 5.

Fire Lookouts are dynamic. Advancing the application time with the time slider allows you to view the expected fire behavior in the future. When you move a Fire Lookout it triggers a new computation the fire behavior and it updates the symbology accordingly. Fire Lookouts are designed to alert the user when a significant change is detected in the future fire behavior. This *lookout* mechanism takes place behind the scenes alerts the user via visual cues.  

### **Weather Scouts**
![Weather SCouts figure n.png](https://bitbucket.org/repo/X96p7y/images/2925472513-Weather%20SCouts%20figure%20n.png)

* Figure 6. Weather Scouts in proximity to Fire Lookouts

Weather Scouts are similar to Fire Lookouts in that they download the weather forecast for their locations.  The Weather Scouts display the weather forecasts using standard weather station symbology. They react to changes in location and time and update their symbology accordingly. The *scouts* are designed to alert the user when a significant change is detected in the forecast. 

* * *

# Vision and Scope
## Business Requirements
### Background
The Campbell Prediction System (CPS) is a practical way to use on-scene observations to determine future fire behavior with support for strategy and tactics to contain the projected fire.  CPS provides the logic and language for better understanding the potential of a fire and allows more strategic tactics to be formulated for where and when to intercept and stop the fire’s forward progress. 

The Wildfire Management Tool (WMT) desktop version provides a view of the CPS primary forces acting on a wildland fire. The software computes the potential fire behavior and displays it in multiple ways, including a Haul Chart showing computed flame lengths and rates of spread, and a depiction of a five minute spread pattern overlaid on the terrain.  The software also provides convenient controls for displaying and interacting with the environmental factors. These controls provide an excellent mechanism for learning about what impacts fire behavior, and for performing "what-if" scenarios to plan for actual fire behavior. The audience for WMT includes instructors and students of fire behavior, firefighters, and land managers.   

The WMT software is constrained to running on a desktop or laptop computer. The software will not run on Android and iOS platforms. People interested in wildland fire behavior—firefighters and the general public—need a system that simply works on their device of choice—smart phone, tablet or laptop/desktop computer—regardless of form factor or operating system.  A web browser based application would satisfy this need.

With the advent of NASA's Web WorldWind platform, the potential exists to create a version of WMT that runs in a web browser. The prospect of running WMT in a web browser opens up the opportunity to run on a variety of devices, including phones, tablets and computers. A web version of WMT has the potential to service a greater number of users, running on a larger number of platforms. The number of user classes also increases to include the general public members who live in the Wildland Urban Interface (WUI).


### Business Objectives and Success Criteria
The following use case diagram depicts, at a high-level of abstraction, how the system serves the needs of various user classes.
 
![Use Case - Business Model.png](https://bitbucket.org/repo/j7XRRd/images/2258592969-Use%20Case%20-%20Business%20Model.png)

*Use Case - Business Model*

#### Business Objectives
ID | Objective
-- | ---------
BO-1 | Provide an effective training tool for the Campbell Prediction System method. This tool should be usable by both the student and the teacher.
BO-2 | Provide a system, to be used on active fires, that reduces loss of life and improves the odds of suppression efforts through the application of tactics derived from the Campbell Prediction System. 
BO-3 | Promote the use of the Campbell Prediction System on the fireground. 

#### Success Criteria
ID | Criteria
-- | ---------
SC-1 | Prevention of firefighter burnovers and fatalities.
SC-2 | Adoption of CPS methodologies by local, state and federal agencies. 
SC-3 | Adoption of CPS in Europe and Australia. 
SC-4 | Requests for software training, documentation and support. 

### Customer Needs
ID | Need
-- | ---------
CN-1 | Fire behavior prediction tools that work without accurate fuel models.
CN-2 | Fire behavior estimations should augment current state-of-the-art fire modeling. 
CN-3 | Field use includes both online and offline Internet connectivity.
CN-4 | Multiple computer platforms: •Android, •iOS, •Windows, •Mac, •Linux.
CN-5 | Multiple hardware devices: • smart phones, •tablets, •laptops, •desktops.
 
### Business Risks
ID | Risk
-- | ---------
BR-1 | Missing the PhiWeek 2018 deadline.
BR-2 | Performance constraints imposed by web hosting services.

## Vision of the Solution
### Vision Statement
*For wildland firefighters and incident command personnel engaged in the suppression of wildland fires who need tactical decision support tools to ensure the safety of firefighters and the effective use of firefighting resources, the** Wildfire Management Tool** is a decision support system and visualization tool that displays the potential fire behavior on the fireground using the CPS methodologies. Unlike the WMT desktop software, this product runs in the web browser on smart phones, tablets, laptops and desktop computers.
* 

### Major Features
ID | Feature
-- | ---------
MF-1 | View multiple, concurrent wildfire behavior icons
MF-2 | Look ahead and alert user of temporal trigger points
MF-3 | Estimate fire behavior along a user defined path.
 
## Assumptions and Dependencies
### Assumptions
ID | Assumption
-- | ---------
AS-1 |.
AS-2 |.

### Dependencies
ID | Dependency
-- | ---------
DE-1 | Web WorldWind SDK
DE-2 | HTML5
DE-3 | WebGL
DE-4 | Apache Tomcat 7 Web Application Server
 
* * *

## Scope and Limitations
### Project Scope
The following context diagram depicts the boundary and connections of the system being developed and everything else in its universe. 
![CPS_Context_Diagram_v1.jpg](https://bitbucket.org/repo/j7XRRd/images/1279148843-CPS_Context_Diagram_v1.jpg)
  
*Figure 2. CPS Context Diagram*

The goal is to develop a system that will allow the user to visualize the fireground and recognize a fire’s potential via a 3D globe running in a web browser, including:

* Wildfire Diamond: an experimental display of fire behavior similar to the NFPA 704 Fire Diamond
* Wildfire Profile: an experimental display of fire behavior along a user defined path
* CPS Primary Forces: Wind, Slope and Preheat
* Fuel Model: Selection and display
* Environmental Influences: Display and override
* Weather Forecasts: Display and use
* Location: Locate and go to major incidents

For environmental inputs, the system will use weather forecasts or diurnal inputs provided by the user.  Fuel models can be selected by the user or provided by LANDFIRE or an agency. 
 
### Scope of Initial Release
##### Foundation
* MF-1 Wildfire Diamonds
* MF-2 Weather Alerts
* MF-3 Fire Behavior Alerts

### Scope of Subsequent Releases
##### Fire Observations/Photographs
* MF-4
* MF-5

##### Fire Pattern Matching (data mining)
* MF-6
* MF-7
 
 
###Limitations and Exclusions
* Restricted to running in a web browser, i.e., not an Android, iPhone or Windows "app".
 
* * *

## Business Context
### Stakeholder Profiles
Stakeholder | Major Benefits | Attitudes | Win Conditions | Constraints 
----------- | ---------------| --------- | -------------- | -----------
***Bruce Schubert*** *Project Sponsor* | Continuing development of software architecture and programming skills; explore new technologies. |Affinity for and history with fire service; primary mission.	| High number of downloads; Internet metrics | Time 
***Doug Campbell*** *CPS Domain Expert* | Increased visibility and acceptance of CPS training and methods. | Strong supporter | Adoption of CPS training by US Federal and State agencies. | Retired 
***Marc Castellnou*** *CPS Practitioner* | Leveraging and promoting new technologies in the fire service. | Early technology adopter; principle user. | Improved fire fighter safety; better tactics and strategies. | Job
 
### Project Priorities

Dimension | Driver (state objective) | Constraint (state limits) | Degree of Freedom (state allowable range)
--------- | ------------------------ | ------------------------- | -----------------------------------------
***Schedule*** | Initial release: PhiWeek 2018	| |
***Quality*** | Product is designed to promote CPS methods and showcase NASA Web World Wind capabilities. | | 	 
***Cost*** | |Open source project developed out of personal budget; budget limited to domain support and development tools; funds for supporting development of Internet database support is limited. | 
***Staff*** | | (1) architect/developer | 	 
***Features*** | | |Complete freedom to explore technologies and methods to best implement the feature set. 
 
### Operating Environment
* Geographically diverse, worldwide user base
* Multiple languages, English may not be the primary language
* Fuel model data inconsistent between countries, or not available
* Fireground/field use anticipated
    * No internet
    * Low internet speed
* Classified, secret or non-public information 
    * Archeological sites
    * Fatalities

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

#### [Inception Phase](https://github.com/WorldWindEarth/wildfire/projects/1)

Iteration | Description | Completion
--------- | ----------- | -----------
I1 | *WorldWindJS/Explorer proof-of-concept and Digital Ocean IaaS* | Sep. 10, 2018

#### [Elaboration Phase](https://github.com/WorldWindEarth/wildfire/projects/3) 

Iteration | Description | Deadline
--------- | ----------- | ---------
[E1](https://github.com/WorldWindEarth/wildfire/milestone/1?closed=1) | *Baseline architecture and supporting environment* | Nov, 10, 2018

#### [Construction Phase](https://github.com/WorldWindEarth/wildfire/projects/4) 

Iteration | Description | Deadline
--------- | ----------- | ---------
[C1](https://github.com/WorldWindEarth/wildfire/milestone/2) | *Sprint 1 - Fire Lookout outputs* | Nov, 16, 2018
[C2](https://github.com/WorldWindEarth/wildfire/milestone/3) | *Sprint 2 - Fire Lookout edits* | TBD
[C3](https://github.com/WorldWindEarth/wildfire/milestone/4) | *Sprint 2 - Predictive services* | TBD

#### [Transistion Phase](https://github.com/WorldWindEarth/wildfire/projects/5) 

Iteration | Description | Deadline
--------- | ----------- | ---------
T1 | WMT Release - Version 2.0.0 | TBD


### Project Monitoring
#### Budget Control
The project is constrained by the author's personal budget. Cloud-based IaaS services are paid for with personal finances. The project receives no financial support from external sources.
 
#### Quality Control
Defects will be recorded in project's [Issue Tracker](https://github.com/WorldWindEarth/wildfire/issues), as will feature requests, proposals, and tasks. Tasks will be tagged with the milestone corresponding the the associated iteration/sprint.

## Annexes
This project will follow the Rational Unified Process (RUP) for Small Projects process.

See also the [Software Design Guidelines][design]
