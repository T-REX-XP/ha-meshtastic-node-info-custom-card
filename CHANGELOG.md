# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025

### Added
- Visual UI configuration editor for easy card setup
- `getConfigElement()` method for Home Assistant UI integration
- `getStubConfig()` method for default configuration
- Entity picker in configuration UI

### Changed
- Updated documentation to highlight UI editor as recommended method

## [1.0.0] - 2025

### Added
- Initial release of Meshtastic Node Card
- Node information display with avatar
- Battery level with visual indicator
- Signal strength (RSSI/SNR) with bars
- Last seen timestamp
- Hardware information display
- Location data display
- Message statistics (total/sent/received)
- Dark theme with modern UI
- Visual UI configuration editor
- HACS support
- GitHub Actions workflows for validation and releases

### Project Structure
- Source files organized in `src/` folder
- Documentation in root and `docs/` folder
- GitHub workflows in `.github/workflows/`
- Comprehensive setup guides (QUICKSTART, PUBLISHING, HACS_SETUP)

### Technical
- Custom HTML element (Web Components)
- Home Assistant 2023.1.0+ compatibility
- No external dependencies
- MIT License
