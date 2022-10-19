# Hazard Analysis

**Team 12, CodeChamp - SWFRENG 4G06**
- Anton Kanugalawattage
- Dipendra Subedi
- Youssef Rizkalla
- Tamas Leung
- Zhiming Zhao
 
# Table of Contents
1. [Introduction](#Introduction)
2. [Background](#Background)
3. [Scope and Purpose of Hazard Analysis](#Scope-and-Purpose-of-Hazard-Analysis)
4. [System Boundary](#System-Boundary)
5. [Definition of Hazard](#Definition-of-Hazard)
6. [Critical Assumptions](#Critical-Assumptions)
7. [Failure Modes & Effects Analysis](#Failure-Modes-and-Effects-Analysis)
    6.1. [Hazards Out of Scope](#Hazards-Out-of-Scope)
    6.2. [Failure Modes and Effects Analysis Table](#Failure-Modes-and-Effects-Analysis-Table)
8. [Safety & Security Requirements](#Safety-and-Security-Requirements)
    7.1. [Access Requirements](#Access-Requirements)
    7.2. [Integrity Requirements](#Integrity-Requirements)
    7.3. [Privacy Requirements](#Privacy-Requirements)
    7.4. [Audit Requirements](#Audit-Requirements)
    7.5. [Immunity Requirements](#Immunity-Requirements)
9. [Roadmap](#Roadmap)

# List of Tables
1. [Revision History](#Revision-History)
2. [Failure Modes & Effects Analysis Table](#Failure-Modes-and-Effects-Analysis-Table)

# List of Figures
N/A

# Revision History
| Date | Developers | Change |
|------|------------|--------|
|  10/18/2022 |  <ul><li> Anton Kanugalawattage</li><li>Dipendra Subedi</li><li>Youssef Rizkalla</li><li>Tamas Leung</li><li>Zhiming Zhao</li></ul>  | Initial Document     |

Table 1: Failure Modes and Effects Analysis

# Introduction
To ensure the system that is built hazard free, potential problematic behaviours must be identified. This document aims to outline the hazard analysis of CodeChamp and to build a roadmap for achieving that goal.

# Background
CodeChamp is a online collaborative web platform used to learn data structure and algorithms. 


# Scope and Purpose of Hazard Analysis
The scope of a hazard analysis is to identify possible hazards from each component of the system, and the purpose of a hazard analysis is to document hazards, the cause and effect of each hazard and how to mitigate each hazard.
# System Boundary
Hazard analysis will be conducted on the following components of CodeChamp:
1. Judge Server
2. Connected Communication
3. Database
4. Authentication
5. Deployment


The system boundary includes five components of the application. The judge server, connected communication service, the database, authentication service, and deployment service. The reliability of the database and deployment services in terms of up time is out of the control of CodeChamp. These play a role in ensuring appropriate data store and uptime of the web application, so they are necessary to be included in the hazard analysis.
# Definition of Hazard
The definition of a hazard used throughout this document is anything that poses a threat to the security, performance, or functionality of the CodeChamp web application.
# Critical Assumptions
There are no critical assumptions being made.


# Failure Modes and Effects Analysis
The Failure Modes and Effects Analysis model was chosen to identify and analyze the system's hazards as well as to define recommended actions and requirements to mitigate them.

## Hazards Out of Scope
1. Deployment issues and outages by the Cloud Provider
2. Database provider outages
3. Failures of the External Identity Management System

These hazards are not managed directly the developers, so our system cannot be directly responsible for them. In the case of hazards, we can attempt to minimize their effects but cannot completely mitigate them.

## Failure Modes and Effects Analysis Table



| Component | Failure Modes | Effects of Failure | Causes of Failure | Recommended Action | SR | Ref |
|-----------|---------------|--------------------|-------------------|--------------------|----|-----|
| Judge Server| Server Outage | Denial of Service | <ol><li> Execution of malicious user code</li> <li> Failure to timeout code beyond specified time limit</li></ol> | Ensure that code is checked before compilation, similar to accounting for a SQL injection attack. Enforce a time and memory limit for each problem. |  [IR4](#Integrity-Requirements) & [AR2](#Access-Requirements)  | HR1 | 
| Connected Communications | Loss of connections | Communcation between server and clients are lost. | <ol><li> Unintentional server restart</li><li> Loss/out of memory</li></ol> | Backup states of the current connections to be used when restarting. |  [IR5](#Integrity-Requirements)  |  HR2   |
| Database |Data Deleted|All data is lost. No problems will be able to be sent to users. No profile information can be viewed|<ol><li>SQL injection attacks</li><li>Unintentional deletes</li></ol>|Maintain automatic backups and restore database to latest backup version|  [IR1](#Integrity-Requirements) & [IR2](#Integrity-Requirements)  |  HR3   |
| Database |Overload of database IO|Server requests will be slowed drastically|<ol><li>Too many requests</li></ol>|Automatic scalling of database | [IR6](#Integrity-Requirements)   | HR4 |
| Server |Overload of server|Server requests will be slowed drastically|<ol><li>Too many client requests</li></ol>|<ol><li>Rate Limiting</li><li>Automatic Vertical Scaling of servers</li></ol>| [IR7](#Integrity-Requirements)    |  HR5   |
| Authentication | Unauthenicated use of services | <ol><li>Services are used without an identity, preventing the system from logging events</li><li>Jeapordizes the integrity of the games the user participates in</li></ol>|<ol><li>Failure of the external Identiy Management system </li><li>Failure of authentiaction middleware in the server</li></ol> | Safeguard the authentiaction middleware so that on failure all requests are rejected. | [AR1](#Access-Requirements) & [AR2](#Access-Requirements)  | HR6    |
| Authentication | Failure to login to service | Users are unable to use service|<ol><li>Failure of the external Identiy Management system </li><li>Failure of authentiaction middleware in the server</li></ol> | Safeguard the authentiaction middleware so that on failure all requests are rejected. | [AR3](#Access-Requirements) | HR7 |

<center>Table 2: Failure Modes and Effects Analysis</center>

# Safety and Security Requirements

## Access Requirements
- AR1 - Users must be logged in to view data they are authorized for
- AR2 - Only admins will be allowed to modify and add new problem data
- AR3 - Requests from unauthenticated users should be rejected
 
## Integrity Requirements
- IR1 - Problem data will be automatically back up on a weekly basis
- IR2 - User profile data will be automatically back up on a daily basis
- IR3 - User data will not be modified
- IR4 - All problems must have a time and memory limit set
- IR5 - Backup connection state every minute to ensure connectivity on restart
- IR6 - Clients will be rate-limited on requests to the server
- IR7 - Distribute connection/requests evenly among servers

## Privacy Requirements
- PR1 - Users will not be able to access unauthorized data of other users

## Audit Requirements
N/A

## Immunity Requirements
N/A

# Roadmap
The hazard analysis has brought forward more requirements that will be implemented within the final application. We will try to implement all requirements based on priority, but may not be able to due to time constraints of the projects. As we approach the end of the project, the hazard analysis will be revisited, to see the hazards that were mitigated, and those which still persist or require additional work.