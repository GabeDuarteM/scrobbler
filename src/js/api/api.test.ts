import { api } from "./api"

jest.mock("./trakt", () => ({
  trakt: {
    seasons: {
      summary: () =>
        // prettier-ignore
        Promise.resolve([{number:0,episodes:[]},{number:1,episodes:[{season:1,number:1,title:"Izuku Midoriya: Origin"},{season:1,number:2,title:"What It Takes to Be a Hero"},{season:1,number:3,title:"Roaring Muscles"},{season:1,number:4,title:"Starting Line"},{season:1,number:5,title:"What I Can Do for Now"},{season:1,number:6,title:"Rage, You Damned Nerd"},{season:1,number:7,title:"Deku vs. Kacchan"},{season:1,number:8,title:"Bakugo's Starting Line"},{season:1,number:9,title:"Yeah, Just Do Your Best, Iida!"},{season:1,number:10,title:"Encounter With the Unknown"},{season:1,number:11,title:"Game Over"},{season:1,number:12,title:"All Might"},{season:1,number:13,title:"In Each of Our Hearts"},{season:1,number:14,title:null}]},{number:2,episodes:[{season:2,number:1,title:"That's the Idea, Ochaco"},{season:2,number:2,title:"Roaring Sports Festival"},{season:2,number:3,title:"In Their Own Quirky Ways"},{season:2,number:4,title:"Strategy, Strategy, Strategy"},{season:2,number:5,title:"Cavalry Battle Finale"},{season:2,number:6,title:"The Boy Born with Everything"},{season:2,number:7,title:"Victory or Defeat"},{season:2,number:8,title:"Battle on, Challengers!"},{season:2,number:9,title:"Bakugo vs. Uraraka"},{season:2,number:10,title:"Shoto Todoroki: Origin"},{season:2,number:11,title:"Fight on, Iida"},{season:2,number:12,title:"Todoroki vs. Bakugo"},{season:2,number:13,title:"Time to Pick Some Names"},{season:2,number:14,title:"Bizarre! Gran Torino Appears"},{season:2,number:15,title:"Midoriya and Shigaraki"},{season:2,number:16,title:"Hero Killer: Stain vs. U.A. Students"},{season:2,number:17,title:"Climax"},{season:2,number:18,title:"The Aftermath of Hero Killer: Stain"},{season:2,number:19,title:"Everyone's Internships"},{season:2,number:20,title:"Listen Up!! A Tale from the Past"},{season:2,number:21,title:"Gear Up for Final Exams"},{season:2,number:22,title:"Yaoyorozu: Rising"},{season:2,number:23,title:"Stripping the Varnish"},{season:2,number:24,title:"Katsuki Bakugou: Origin"},{season:2,number:25,title:"Encounter"},{season:2,number:26,title:null}]},{number:3,episodes:[{season:3,number:1,title:"Game Start"},{season:3,number:2,title:"Wild, Wild Pussycats"},{season:3,number:3,title:"Kota"},{season:3,number:4,title:"My Hero"},{season:3,number:5,title:"Episode 5"},{season:3,number:6,title:"Episode 6"},{season:3,number:7,title:"Episode 7"},{season:3,number:8,title:"Episode 8"},{season:3,number:9,title:"Episode 9"},{season:3,number:10,title:"Episode 10"},{season:3,number:11,title:"Episode 11"},{season:3,number:12,title:"Episode 12"},{season:3,number:13,title:"Episode 13"},{season:3,number:14,title:"Episode 14"},{season:3,number:15,title:"Episode 15"},{season:3,number:16,title:"Episode 16"},{season:3,number:17,title:"Episode 17"},{season:3,number:18,title:"Episode 18"},{season:3,number:19,title:"Episode 19"},{season:3,number:20,title:"Episode 20"},{season:3,number:21,title:"Episode 21"},{season:3,number:22,title:"Episode 22"},{season:3,number:23,title:"Episode 23"},{season:3,number:24,title:"Episode 24"},{season:3,number:25,title:"Episode 25"}]}]),
    },
    episodes: {},
    search: {
      text: () =>
        // prettier-ignore
        Promise.resolve([{type: "show",score: 1000,show: {title: "My Hero Academia",year: 2016,ids: {trakt: 104311,slug: "my-hero-academia",tvdb: 305074,imdb: "tt5626028",tmdb: 65930,tvrage: {}}}},{type: "movie",score: -3.4028235e38,movie: {title: "My Hero Academia the Movie: The Two Heroes",year: 2018,ids: {trakt: 352457,slug: "my-hero-academia-the-movie-the-two-heroes-2018",imdb: "tt7745068",tmdb: 505262}}}]),
    },
  },
}))
describe("Api", () => {
  describe("getEpisodeAbsolute", () => {
    it("should return S01E01 when the absolute ep is 01", async () => {
      const epAbsoluteNumber = 1

      const expectedSeason = 1
      const expectedEpisode = 1
      const episode = await api.getEpisodeAbsolute(
        "my-hero-academia",
        epAbsoluteNumber,
      )
      expect(episode.season).toBe(expectedSeason)
      expect(episode.number).toBe(expectedEpisode)
    })
    it("should return S03E01 when the absolute ep is 41", async () => {
      const epAbsoluteNumber = 41

      const expectedSeason = 3
      const expectedEpisode = 3
      const episode = await api.getEpisodeAbsolute(
        "my-hero-academia",
        epAbsoluteNumber,
      )
      expect(episode.season).toBe(expectedSeason)
      expect(episode.number).toBe(expectedEpisode)
    })
    it("should return S02E25 when the absolute ep is 38", async () => {
      const epAbsoluteNumber = 38

      const expectedSeason = 2
      const expectedEpisode = 25
      const episode = await api.getEpisodeAbsolute(
        "my-hero-academia",
        epAbsoluteNumber,
      )
      expect(episode.season).toBe(expectedSeason)
      expect(episode.number).toBe(expectedEpisode)
    })
  })
})
