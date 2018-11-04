# The Wildfire Management Tool - WMT 2.0
An HTML5/JavaScript geo-browser with weather forecasts and wildland fire potentials built with the NASA WorldWind SDK.

### Contents
- [Overview](#overview)
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
