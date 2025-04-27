import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AsciiArt from "@/components/ascii-art"
import Link from "next/link"

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 pixel-text glow-text text-primary">
        Legal Information
        <span className="chinese-caption block">法律信息</span>
      </h1>

      <AsciiArt type="divider" />

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
        </TabsList>
        <TabsContent value="terms">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="pixel-text">Terms of Service</CardTitle>
              <CardDescription>Last updated: March 29, 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <h3 className="font-bold text-base">1. Acceptance of Terms</h3>
              <p>
                By accessing or using Yī Bāng (the "Platform"), you agree to be bound by these Terms of Service. If you
                do not agree to these terms, please do not use the Platform.
              </p>

              <h3 className="font-bold text-base">2. Eligibility</h3>
              <p>
                You must be at least 18 years old to use the Platform. By using the Platform, you represent and warrant
                that you are at least 18 years of age. If you are under 18 years old, you may not, under any
                circumstances or for any reason, use the Platform.
              </p>

              <h3 className="font-bold text-base">3. Description of Service</h3>
              <p>
                Yī Bāng is a crypto-native message board that allows users to create posts, comment, and interact with
                other users. The Platform may include various features and functionalities related to cryptocurrency and
                blockchain technology.
              </p>

              <h3 className="font-bold text-base">4. User Accounts</h3>
              <p>
                To access certain features of the Platform, you may be required to create an account. You are
                responsible for maintaining the confidentiality of your account information and for all activities that
                occur under your account.
              </p>

              <h3 className="font-bold text-base">5. User Content</h3>
              <p>
                Users may post content on the Platform. By posting content, you grant Yī Bāng a non-exclusive,
                royalty-free license to use, modify, and display that content in connection with the Platform.
              </p>

              <h3 className="font-bold text-base">6. Prohibited Conduct</h3>
              <p>Users agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Post content that is illegal, harmful, threatening, abusive, or otherwise objectionable</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with the proper functioning of the Platform</li>
                <li>Engage in any activity that could disable, overburden, or impair the Platform</li>
              </ul>

              <h3 className="font-bold text-base">7. Termination</h3>
              <p>
                Yī Bāng reserves the right to terminate or suspend your account and access to the Platform at any time,
                without notice, for conduct that we believe violates these Terms of Service or is harmful to other
                users, us, or third parties, or for any other reason.
              </p>

              <h3 className="font-bold text-base">8. Disclaimer of Warranties</h3>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED.
              </p>

              <h3 className="font-bold text-base">9. Limitation of Liability</h3>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, YĪ BĀNG SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>

              <h3 className="font-bold text-base">10. Changes to Terms</h3>
              <p>
                Yī Bāng reserves the right to modify these Terms of Service at any time. We will provide notice of
                significant changes by posting the new Terms on the Platform.
              </p>

              <h3 className="font-bold text-base">11. Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
                Yī Bāng operates, without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="pixel-text">Privacy Policy</CardTitle>
              <CardDescription>Last updated: March 29, 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <h3 className="font-bold text-base">1. Information We Collect</h3>
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Account Information:</strong> When you create an account, we collect your username, email
                  address, and password.
                </li>
                <li>
                  <strong>Profile Information:</strong> Information you provide in your user profile, such as a bio or
                  profile picture.
                </li>
                <li>
                  <strong>Content:</strong> Information you post on the Platform, including posts, comments, and
                  messages.
                </li>
                <li>
                  <strong>Usage Information:</strong> Information about how you use the Platform, such as the pages you
                  visit and the features you use.
                </li>
                <li>
                  <strong>Device Information:</strong> Information about the device you use to access the Platform, such
                  as your IP address, browser type, and operating system.
                </li>
              </ul>

              <h3 className="font-bold text-base">2. How We Use Your Information</h3>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide, maintain, and improve the Platform</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative messages, updates, and security alerts</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with the Platform</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize and improve your experience on the Platform</li>
              </ul>

              <h3 className="font-bold text-base">3. Information Sharing and Disclosure</h3>
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>With vendors, consultants, and other service providers who need access to such information</li>
                <li>
                  In response to a request for information if we believe disclosure is in accordance with any applicable
                  law, regulation, or legal process
                </li>
                <li>
                  If we believe your actions are inconsistent with our user agreements or policies, or to protect the
                  rights, property, and safety of Yī Bāng or others
                </li>
                <li>
                  In connection with, or during negotiations of, any merger, sale of company assets, financing, or
                  acquisition of all or a portion of our business by another company
                </li>
                <li>With your consent or at your direction</li>
              </ul>

              <h3 className="font-bold text-base">4. Data Security</h3>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
                access, disclosure, alteration, and destruction.
              </p>

              <h3 className="font-bold text-base">5. Your Choices</h3>
              <p>
                You can access, update, and delete certain information about you from your account settings. You can
                also opt out of receiving promotional communications from us by following the instructions in those
                communications.
              </p>

              <h3 className="font-bold text-base">6. Changes to this Policy</h3>
              <p>
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising
                the date at the top of the policy and, in some cases, we may provide you with additional notice.
              </p>

              <h3 className="font-bold text-base">7. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  our contact page
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cookies">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="pixel-text">Cookie Policy</CardTitle>
              <CardDescription>Last updated: March 29, 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <h3 className="font-bold text-base">1. What Are Cookies</h3>
              <p>
                Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                They are widely used to make websites work more efficiently and provide information to the owners of the
                site.
              </p>

              <h3 className="font-bold text-base">2. How We Use Cookies</h3>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly.
                  They enable core functionality such as security, network management, and account access.
                </li>
                <li>
                  <strong>Functionality Cookies:</strong> These cookies allow us to remember choices you make and
                  provide enhanced features. For instance, we may be able to provide you with news or updates relevant
                  to the services you use.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our
                  website by collecting and reporting information anonymously.
                </li>
                <li>
                  <strong>Targeting Cookies:</strong> These cookies record your visit to our website, the pages you have
                  visited, and the links you have followed to recognize you when you return to our site.
                </li>
              </ul>

              <h3 className="font-bold text-base">3. Third-Party Cookies</h3>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics
                of the Platform and deliver advertisements on and through the Platform.
              </p>

              <h3 className="font-bold text-base">4. Managing Cookies</h3>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit
                the ability of websites to set cookies, you may worsen your overall user experience, since it will no
                longer be personalized to you.
              </p>

              <h3 className="font-bold text-base">5. Changes to this Cookie Policy</h3>
              <p>
                We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or
                for other operational, legal, or regulatory reasons.
              </p>

              <h3 className="font-bold text-base">6. Contact Us</h3>
              <p>
                If you have any questions about our use of cookies, please contact us at{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  our contact page
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
