# Image Management System

A comprehensive image management application built with Next.js, Material UI, React Query, and React Konva for image annotation.

## Features

- **Image Management**: Upload, view, and delete images with metadata
- **Category Management**: Create, update, and delete categories for organizing images
- **Advanced Filtering**: Search images by name and metadata, filter by category
- **Image Annotation**: Draw rectangles on images with customizable colors using React Konva
- **Responsive Design**: Fully responsive UI that works on all devices
- **Real-time Updates**: React Query for efficient data fetching and caching

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material UI (MUI)
- **State Management**: React Query (@tanstack/react-query)
- **Drawing Library**: React Konva (for image annotation)
- **Styling**: Material UI theming + CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd averroes
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /images/[id]   - Image detail and annotation page
  layout.js      - Root layout with providers
  page.js        - Home page with image gallery and categories
  providers.js   - React Query and MUI theme providers

/components
  CategoryDialog.js       - Create/edit category modal
  ConfirmDialog.js        - Deletion confirmation dialog
  ImageAnnotator.js       - Canvas-based annotation tool
  ImageGallery.js         - Grid display of images
  ImageUploadDialog.js    - Image upload form

/hooks
  useAnnotations.js  - Annotation data hooks
  useCategories.js   - Category data hooks
  useImages.js       - Image data hooks

/lib
  api.js  - API client functions
```

## API Integration

The application connects to a JSON placeholder API:
- Base URL: `https://my-json-server.typicode.com/MostafaKMilly/demo`
- Endpoints: `/categories`, `/images`, `/annotations`

**Note**: The API is read-only. All mutations are simulated and changes won't persist on the server.

## Features Implementation

### Image Management
- Upload images with name, URL, category, and metadata
- View images in a responsive grid gallery
- Delete images with confirmation dialog
- Click on images to view details and annotate

### Category Management
- Create new categories with name and description
- Edit existing categories
- Delete categories with confirmation
- View all categories in a dedicated tab

### Filtering & Search
- Search images by name or metadata content
- Filter images by category using dropdown
- Real-time search results

### Image Annotation
- Draw rectangles on images using mouse drag
- Choose from 6 predefined colors for annotations
- Delete last annotation
- Save annotations (stored locally due to API limitations)
- View existing annotations when opening images

## Notes

- Since the API is a JSON placeholder and doesn't persist data, annotations are stored in local state
- The application provides user feedback for all operations
- Error handling is implemented for API failures
- Responsive design ensures usability across all device sizes

## Future Enhancements

- Implement real backend with persistent storage
- Add more annotation tools (circles, polygons, text)
- Support for batch image uploads
- Export annotations in various formats
- User authentication and authorization
