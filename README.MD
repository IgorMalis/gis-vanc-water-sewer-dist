# Vancouer Water & Sewer Distribution Visualizer

A web-based tool for visualizing the water & sewer distribution networks of the City of Vancouver, British Columbia. Displays several aspects of the water and sewer systems using Vancouver's [OpenData](https://opendata.vancouver.ca/pages/home/) (publicly available GIS datasets), overlaid on an interactive, two-dimensional map.

![Preview](https://github.com/IgorMalis/gis-vanc-water-sewer-dist/blob/master/screens/preview.png?raw=true)

Several features of Vancouer's water & sewer networks can be toggle on & off:

- Water transmissions mains
- Water distribution mains
- Abandoned water mains
- Water hydrants
- Water control valves
- Sewer mains
- GVRD sewer mains
- Sewer catch basins
- Sewer manholes

Each feature is shown using a different colour using the colour palette below:

![Preview](https://github.com/IgorMalis/gis-vanc-water-sewer-dist/blob/master/screens/colours.png?raw=true)

Two modes of interaction with the map are supported:
- A computer with a pointing device can hover over each feature with the mouse cursor to display additional information related to the feature
- A handheld device, such as a tablet, can also be used to activate a tooltip showing this information by clicking/tapping on the feature

When a feature is activated, its radius is increased (for a marker), or its weight is increased (for polylines):

![Preview](https://github.com/IgorMalis/gis-vanc-water-sewer-dist/blob/master/screens/tooltip.png?raw=true)

## Technical features

- [Leaflet.js](https://leafletjs.com) is the mapping component used, which utilizes map tiles provided by [OpenStreetMap](https://www.openstreetmap.org)
- Node.js is used for the server-side application, which incorporates the `http` module to serve the front-end application, and provides 9 API endpoints which pass the data from the server-side application to the front-end application
- The server-side application reads and processes each of the 9 data files (in CSV format) on start-up, and stores them in-memory using Node's `NodeCache` class. Storing all data in-memory requires the Node.js process to use up an additional (approximately) 175 MB more RAM
- Each of the nine features can be toggled on or off independently. When toggled on, the server-side API is called, which retrieves the geographical data (location and attributes) in JSON format

## API

The server-side application provides the following nine API endpoints:

- Water transmission mains: `/api/watertransmain`
- Water distribution mains: `/api/waterdistrmain`
- Abandoned water mains: `/api/abandwaterrmain`
- Water hydrants: `/api/waterhydrant`
- Water control valves: `/api/waterctrlvalve`
- Sewer mains: `/api/sewermain`
- GVRD sewer mains: `/api/sewergvrdmain`
- Sewer catch basins: `/api/sewercatchbasin`
- Sewer manholes: `/api/manhole`

Each API endpoint requires four parameters (n,e,s,w) to be passed as querystring parameters, which represent the bounding box used to filter the data. For example `http://localhost:8000/api/sewermain?n=49.24251108553272&s=49.24058483393303&e=-123.03943991661073&w=-123.04306626319887`

The API is called each time the map view is modified (panned or zoomed), so that only data within the active viewport is retrieved and added to Leaflet's map layer.

# Instructions

To run the code, clone the repository and navigate to the directory containing the `package.json` file. Use the following commands to install the required Node modules, and launch the application:

```bash
npm install
npm run start
```

After the application finishes loading the CSV files, the front-end will be available at the following address: `http://localhost:8000`
