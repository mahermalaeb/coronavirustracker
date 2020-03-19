# Coronavirus Tracker

## Automated contact tracing, at scales no longer possible with human detective work

Coronavirus Tracker is an app that allows users to report symptoms, traces anyone who they have come into contact with over the past 5 days, and alerts these people to self-quarantine. It is designed to be implimented by Governments at country-wide scale.

## How it Works

![App home screen informs user of potential contact, tracks their location and allows the user to check symptoms](./pitch/images/home-screenshot-iphone.jpg)

1. User's 3-dimensional location (longitude, latitude, altitude) is captured every 10 seconds. For situations where GPS is not available, their proximity to other users is captured using bluetooth.
2. A user can click 'check symptoms' to determine if they may be infected.
3. Infected user's location data is cross compared against all users. For those who have had siginificant contact (initially 5+ minutes within 2m of distance), they will be advised to self-quarantine. This is done recursively with increasing time-requirements. That is to say, if person A was in contact with person B for 10 miuntes, and then person B was in contact with person C for 2 hours, person C will also be told to self-quarantine.

## Data returned to governments/health bodies

Note: All data will of course be approximate, and steps will be taken to ensure that it is anonymised.

- Geographic distribution of infected people.
- Number of infected people.
- Average amount of time required to become infected.

## Key challenges

- Requesting public adoption on a large scale.
- Data handling costs - which could react £1m+/day
- Privacy concerns (mitigated to an extent by careful anonymising wtih e.g. approximate locations for government statistics).

## Request for collaberators

Please contact alan@skyhookadventure.com if you are capable of authorising this project within your government, or if you have a useful skill set including:

- Designing data-intensive cloud-first systems
- React native & app-building
- Accessibility
