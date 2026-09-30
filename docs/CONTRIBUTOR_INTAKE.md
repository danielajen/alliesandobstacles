# Family and Disability Activism: contributor page information

*For the volunteer contacting chapter authors. Send each contributor the questions below and paste their answers into `content/people.mjs`.*

---

Hello! We're building **alliesandobstacles.com**, the website for *Family and Disability Activism: Beyond Allies and Obstacles* and *Allies and Obstacles*. Every chapter author gets their own entry on the Contributors page, and we'd love to include you. Everything below is optional, so share only what you're comfortable with.

1. **Your name** as you'd like it shown.
2. **Your chapter title.**
3. **A short bio**, one to three sentences, in your own words. Include pronouns if you'd like them shown.
4. **A photo** (optional). A square headshot works best. Please also send a one-line description of the photo for screen-reader users, e.g. *"Jane smiling outdoors, wearing a green scarf."*
5. **Links** you'd like shared, such as your website, organization, publications, social media, or podcast appearances. Give each one a short label.
6. **News or updates**, such as a new publication, a talk, an award, or a project. Include the date and a link if there is one. You can send more updates any time.
7. **Anything we should *not* share**, or any other wording preferences.

Thank you. We'll send you a link to preview your entry before it goes live.

---

### How answers map onto the site (for whoever edits `content/people.mjs`)

```js
{
  name: 'Jane Doe',
  chapter: 'Chapter title here',
  bio: 'Jane Doe (she/her) is …',
  photo: 'assets/img/jane-doe.jpg',
  photoAlt: 'Jane smiling outdoors, wearing a green scarf',
  links: [
    { label: 'Website', url: 'https://…' },
    { label: 'Latest article in Disability Studies Quarterly', url: 'https://…' },
  ],
  updates: [
    { date: '2026-10-15', text: 'Spoke at the Society for Disability Studies conference', url: 'https://…' },
  ],
},
```
