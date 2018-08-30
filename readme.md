![](screenshot.png)

# Chimp Front-End Developer Javascript Code Challenge

A simple React app to find and add pokemon to a team.

## Development Use:
- `npm install`
- `npm start`

## Production Use:
- `npm install`
- `npm run build-prod`
- `cd dist`
- `python3 -m http.server`

## Acceptance Criteria:
- User can find a pokemon from a search field with typeahead suggestions based on name.
- User list of suggestions is grouped by Types (water, fire, ghost, etc...).
- User can select a pokemon and add it to their team.
- User can see information about their team pokemon including name, sprite, stats(hp, speed, special-defence, special-attack, defence, attack).
- User can remove pokemon from their team.
- User sees the zero state message when all added pokemon are removed.
- User can not add more than 6 pokemon to their team.
- User sees disabled search field when 6 pokemon are on the team.
